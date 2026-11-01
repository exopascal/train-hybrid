import { SITE_AUTH_COOKIE, getSiteAuthToken } from '../utils/site-auth'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{ username?: string; password?: string }>(event)
  const { siteAuthUsers, siteAuthPassword } = useRuntimeConfig(event)

  if (!siteAuthUsers || !siteAuthPassword) {
    throw createError({ statusCode: 500, statusMessage: 'Site auth is not configured' })
  }

  const validUsers = siteAuthUsers.split(',').map((u: string) => u.trim()).filter(Boolean)

  if (!validUsers.includes(username ?? '') || password !== siteAuthPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  setCookie(event, SITE_AUTH_COOKIE, getSiteAuthToken(username!, siteAuthPassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { ok: true }
})
