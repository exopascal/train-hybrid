import { validateCredentials, createSessionToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body ?? {}

  if (!username || !password) {
    throw createError({ statusCode: 400, message: 'Benutzername und Passwort erforderlich' })
  }

  const valid = await validateCredentials(username, password)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Ungültige Anmeldedaten' })
  }

  const token = await createSessionToken(username)
  setCookie(event, 'auth_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return { success: true }
})
