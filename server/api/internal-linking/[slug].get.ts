import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

type SiteIndexEntry = {
  id: string
  title: string
  url: string
  type?: string
  published?: boolean
}

type SuggestionPayload = {
  related_articles?: string[]
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug" })
  }

  try {
    const suggestionPath = resolve(process.cwd(), "output", "internal-linking", `${slug}.json`)
    const siteIndexPath = resolve(process.cwd(), "data", "site-index", "site-index.json")

    const [suggestionRaw, siteIndexRaw] = await Promise.all([
      readFile(suggestionPath, "utf8"),
      readFile(siteIndexPath, "utf8"),
    ])

    const suggestion = JSON.parse(suggestionRaw) as SuggestionPayload
    const siteIndex = JSON.parse(siteIndexRaw) as SiteIndexEntry[]
    const relatedIds = Array.isArray(suggestion.related_articles) ? suggestion.related_articles : []

    const byId = new Map(
      siteIndex
        .filter((entry) => entry?.type === "blog_article" && entry?.published === true)
        .map((entry) => [entry.id, entry]),
    )

    const related = relatedIds
      .filter((id) => id !== slug)
      .map((id) => byId.get(id))
      .filter((entry): entry is SiteIndexEntry => Boolean(entry))
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
        url: entry.url,
      }))

    return { related }
  } catch {
    return { related: [] }
  }
})
