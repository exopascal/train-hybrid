import { createError } from "h3"

type ContextChunk = { source: string; title: string; text: string }

export async function renderAnswerFromContext(params: {
  apiKey: string
  userMessage: string
  context: ContextChunk[]
  asksForSources: boolean
}): Promise<string> {
  const { apiKey, userMessage, context, asksForSources } = params

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing OpenAI API key",
    })
  }

  const contextBlock = context
    .map(
      (chunk, index) =>
        `### Quelle [${index + 1}]\nTitel: ${chunk.title}\nPfad: ${chunk.source}\nInhalt:\n${chunk.text}`
    )
    .join("\n\n")

  const systemRules = [
    "Du bist ein präziser RAG-Assistent für Train Hybrid.",
    "Nutze ausschließlich den bereitgestellten KONTEXT.",
    "Erfinde keine Fakten und nutze kein externes Wissen.",
    "Wenn der Kontext nicht reicht, sage das klar in 1 Satz.",
    "Antworte direkt, sachlich und kompakt (maximal 6 Sätze).",
    "Kein Sales-Ton, keine Funnel-Fragen, keine CTA, keine Termin- oder PDF-Angebote.",
    asksForSources
      ? 'Wenn Quellen gewünscht sind: hänge am Ende eine Zeile "Quellen:" an und liste die Pfade (Pfad: ...), max. 3.'
      : "Gib keine Quellen an, außer der Nutzer fragt explizit danach.",
  ].join(" ")

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_tokens: 260,
      messages: [
        { role: "system", content: systemRules },
        {
          role: "user",
          content: `Nutzerfrage:\n${userMessage}\n\nKONTEXT (nur daraus antworten):\n${contextBlock}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "")
    throw createError({
      statusCode: response.status,
      statusMessage: "OpenAI request failed",
      data: errorText || response.statusText,
    })
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  let content = payload?.choices?.[0]?.message?.content?.trim() ?? ""

  const MAX_CHARS = 1200
  if (content.length > MAX_CHARS) content = `${content.slice(0, MAX_CHARS).trim()}…`

  return content
}
