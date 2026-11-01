import { SITE_AUTH_COOKIE, getValidTokens } from '../utils/site-auth'

export default defineEventHandler((event) => {
  const path = event.path.split('?')[0]

  const isExempt =
    path === '/login' ||
    path === '/api/login' ||
    path === '/fragebogen' ||
    path === '/api/fragebogen' ||
    path.startsWith('/_nuxt/') ||
    path.startsWith('/_ipx/') ||
    /\.[a-z0-9]+$/i.test(path)

  if (isExempt) return

  const { siteAuthUsers, siteAuthPassword } = useRuntimeConfig(event)
  if (!siteAuthUsers || !siteAuthPassword) return

  const validTokens = getValidTokens(siteAuthUsers, siteAuthPassword)
  const cookie = getCookie(event, SITE_AUTH_COOKIE)
  if (cookie && validTokens.includes(cookie)) return

  if (path.startsWith('/api/')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return sendRedirect(event, `/login?redirect=${encodeURIComponent(path)}`)
})
