const MAX_BYTES = 200_000
const ID_RE = /^r[a-z0-9]{6,40}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)
  const record = body?.record
  const contact = body?.contact

  if (!record || typeof record !== 'object' || record.schema !== 'th-form-v3' || !ID_RE.test(String(record.runId))) {
    throw createError({ statusCode: 400, statusMessage: 'Ungültige Daten' })
  }
  const json = JSON.stringify(record)
  if (json.length > MAX_BYTES) throw createError({ statusCode: 413, statusMessage: 'Zu groß' })

  const { url, headers } = useSupabase()

  try {
    await $fetch(`${url}/rest/v1/quiz_results`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: {
        quiz: 'fragebogen',
        answers: { ...record, receivedAt: new Date().toISOString() },
      },
    })

    if (
      contact
      && contact.consent === true
      && contact.runId === record.runId
      && EMAIL_RE.test(String(contact.email))
      && String(contact.email).length < 200
    ) {
      await $fetch(`${url}/rest/v1/leads`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=minimal,resolution=ignore-duplicates' },
        body: {
          email: String(contact.email).trim(),
          source: 'fragebogen',
          consent_at: String(contact.consentAt || new Date().toISOString()),
        },
      })
    }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Speichern fehlgeschlagen' })
  }

  return { ok: true }
})
