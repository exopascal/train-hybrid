import { promises as fs } from "fs"
import path from "path"
import { renderAnswerFromContext } from "../providers/openai"

type Frontmatter = {
  access?: string
  type?: string
  topic_tags?: string[] | string
  id?: string
}

type DocRecord = {
  id: string
  path: string
  content: string
  frontmatter: Frontmatter
}

type SourceRoot = {
  root: string
  requirePublicAccess: boolean
}

// RED-FLAG (DATA GOVERNANCE) [Jan Sugint]:
// Die Auswahl und Freigabe der Chat-Quellen muss durch einen Senior-Entwickler
// bzw. Data Owner explizit geprüft und freigegeben werden.
// Betroffen sind insbesondere zusätzliche Quellen außerhalb von knowledge/recipes.

const ROUTE_THRESHOLD = 0.15

const tokenize = (input: string) => {
  const tokens = input
    .toLocaleLowerCase("de-DE")
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3)

  return Array.from(new Set(tokens)).slice(0, 10)
}

const extractFrontmatter = (raw: string) => {
  if (!raw.startsWith("---")) {
    return { frontmatter: {}, body: raw }
  }

  const parts = raw.split("\n")
  let endIndex = -1
  for (let i = 1; i < parts.length; i += 1) {
    if (parts[i].trim() === "---") {
      endIndex = i
      break
    }
  }

  if (endIndex === -1) {
    return { frontmatter: {}, body: raw }
  }

  const fmLines = parts.slice(1, endIndex)
  const body = parts.slice(endIndex + 1).join("\n").trim()
  const frontmatter: Frontmatter = {}

  for (const line of fmLines) {
    const [keyRaw, ...rest] = line.split(":")
    if (!keyRaw || rest.length === 0) continue
    const key = keyRaw.trim()
    const value = rest.join(":").trim()

    if (key === "access") {
      frontmatter.access = value
    } else if (key === "type") {
      frontmatter.type = value
    } else if (key === "id") {
      frontmatter.id = value
    } else if (key === "topic_tags") {
      const cleaned = value.replace(/^\[|\]$/g, "")
      frontmatter.topic_tags = cleaned
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    }
  }

  return { frontmatter, body }
}

const collectMarkdown = async (root: string) => {
  const results: string[] = []
  try {
    const entries = await fs.readdir(root, { withFileTypes: true })
    for (const entry of entries) {
      const entryPath = path.join(root, entry.name)
      if (entry.isDirectory()) {
        const nested = await collectMarkdown(entryPath)
        results.push(...nested)
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        results.push(entryPath)
      }
    }
  } catch {
    return []
  }
  return results
}

const buildDocRecords = async (sources: SourceRoot[]) => {
  const docs: DocRecord[] = []
  for (const source of sources) {
    const files = await collectMarkdown(source.root)
    for (const filePath of files) {
      try {
        const raw = await fs.readFile(filePath, "utf-8")
        const { frontmatter, body } = extractFrontmatter(raw)
        if (source.requirePublicAccess && frontmatter.access !== "public") continue

        const relativePath = path.relative(process.cwd(), filePath)
        const id = frontmatter.id ?? path.basename(filePath, ".md")

        docs.push({
          id,
          path: relativePath,
          content: body,
          frontmatter,
        })
      } catch {
        continue
      }
    }
  }

  return docs
}

const scoreDoc = (tokens: string[], content: string) => {
  if (tokens.length === 0) return 0
  const lower = content.toLowerCase()
  let hits = 0
  for (const token of tokens) {
    if (lower.includes(token)) hits += 1
  }
  return hits / tokens.length
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    message?: string
    analysis?: Record<string, string | number>
  }>(event)
  const message = body?.message?.trim() ?? ""
  const analysis = body?.analysis ?? {}

  if (!message) {
    return {
      reply: "Stell mir gerne eine konkrete Frage zu Training, Ablauf oder Inhalten von Train Hybrid.",
      ...(process.dev ? { debug: { topSources: [], score: 0 } } : {}),
    }
  }

  const tokens = tokenize(message)
  if (tokens.length === 0) {
    return {
      reply: "Bitte formuliere die Frage etwas konkreter, damit ich die passende Information aus den Quellen ziehen kann.",
      ...(process.dev ? { debug: { topSources: [], score: 0 } } : {}),
    }
  }

  const root = process.cwd()
  const contentRoot = path.join(root, "content")
  const knowledgeRoot = path.join(root, "content", "knowledge")
  const recipesRoot = path.join(root, "content", "knowledge", "nutrition", "recipes")
  const legacyRecipesRoot = path.join(root, "content", "recipes")
  const blogRoot = path.join(root, "content", "blog")

  // RED-FLAG (SENIOR APPROVAL REQUIRED) [Jan Sugint]:
  // `content/blog` ist als zusätzliche Datenquelle für den Chat aktiviert.
  // Diese Datenlage sollte vor Go-Live fachlich/rechtlich freigegeben werden.
  const docs = await buildDocRecords([
    { root: knowledgeRoot, requirePublicAccess: true },
    { root: recipesRoot, requirePublicAccess: true },
    { root: legacyRecipesRoot, requirePublicAccess: true },
    { root: blogRoot, requirePublicAccess: false },
  ])
  if (docs.length === 0) {
    return {
      reply: "Ich finde gerade keine Wissensquellen im Projekt, aus denen ich antworten kann.",
      ...(process.dev ? { debug: { topSources: [], score: 0 } } : {}),
    }
  }

  const scored = docs
    .map((doc) => ({ doc, score: scoreDoc(tokens, doc.content) }))
    .sort((a, b) => b.score - a.score)

  const top = scored.slice(0, 3)
  const topScore = top[0]?.score ?? 0
  const topSources = top.map((item) =>
    path.relative(contentRoot, path.join(root, item.doc.path))
  )

  if (topScore < ROUTE_THRESHOLD) {
    return {
      reply:
        "Dazu habe ich in meinen hinterlegten Quellen nichts Konkretes gefunden. Frag bitte präziser oder nenne das Thema genauer.",
      ...(process.dev
        ? {
            debug: {
              topSources,
              score: topScore,
            },
          }
        : {}),
    }
  }

  const asksForSources = /quelle|woher|beleg|sources?/i.test(message)
  const analysisContext = Object.keys(analysis).length > 0
    ? {
        source: "hybrid-analysis/current-session",
        title: "Aktuelle Hybrid-Analyse",
        text: JSON.stringify(analysis, null, 2),
      }
    : null
  const context = top.map((item) => {
    const source = path.relative(contentRoot, path.join(root, item.doc.path))
    return {
      source,
      title: path.basename(source),
      text: item.doc.content.slice(0, 1400),
    }
  })
  const combinedContext = analysisContext ? [analysisContext, ...context] : context

  const { OPENAI_API_KEY } = useRuntimeConfig()
  const reply = await renderAnswerFromContext({
    apiKey: OPENAI_API_KEY,
    userMessage: message,
    context: combinedContext,
    asksForSources,
  })

  const safeReply =
    reply?.trim() ||
    "Ich konnte aus den vorhandenen Quellen keine saubere Antwort ableiten. Stell die Frage bitte enger gefasst."

  return {
    reply: safeReply,
    ...(process.dev
      ? {
          debug: {
            topSources: combinedContext.map((item) => item.source),
            score: topScore,
          },
        }
      : {}),
  }
})
