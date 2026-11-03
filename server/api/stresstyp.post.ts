const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_TYPES = new Set(['weglaeufer', 'gruebler', 'durchhalter', 'kuemmerer', 'neustarter'])

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Ungültige Daten' })
  }

  const email = String(body.email || '').trim()
  const result = String(body.result || '')

  if (!EMAIL_RE.test(email) || email.length > 200) {
    throw createError({ statusCode: 400, statusMessage: 'Ungültige E-Mail' })
  }
  if (!VALID_TYPES.has(result)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungültiges Ergebnis' })
  }

  const { url, headers } = useSupabase()

  try {
    await $fetch(`${url}/rest/v1/leads`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal,resolution=ignore-duplicates' },
      body: {
        email,
        source: 'stresstyp',
        consent_at: new Date().toISOString(),
      },
    })

    await $fetch(`${url}/rest/v1/quiz_results`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: {
        quiz: 'stresstyp',
        result,
        answers: { ...body.answers, receivedAt: new Date().toISOString() },
      },
    })
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Speichern fehlgeschlagen' })
  }

  return { ok: true }
})
