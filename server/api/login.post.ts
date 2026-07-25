import { SITE_AUTH_COOKIE, getSiteAuthToken } from '../utils/site-auth'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{ username?: string; password?: string }>(event)
  const { siteAuthUser, siteAuthPassword } = useRuntimeConfig(event)

  if (!siteAuthUser || !siteAuthPassword) {
    throw createError({ statusCode: 500, statusMessage: 'Site auth is not configured' })
  }

  if (username !== siteAuthUser || password !== siteAuthPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  setCookie(event, SITE_AUTH_COOKIE, getSiteAuthToken(siteAuthUser, siteAuthPassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { ok: true }
})
