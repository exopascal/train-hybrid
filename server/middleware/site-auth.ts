import { SITE_AUTH_COOKIE, getSiteAuthToken } from '../utils/site-auth'

export default defineEventHandler((event) => {
  const path = event.path.split('?')[0]

  const isExempt =
    path === '/login' ||
    path === '/api/login' ||
    path.startsWith('/_nuxt/') ||
    path.startsWith('/_ipx/') ||
    /\.[a-z0-9]+$/i.test(path)

  if (isExempt) return

  const { siteAuthUser, siteAuthPassword } = useRuntimeConfig(event)
  if (!siteAuthUser || !siteAuthPassword) return

  const cookie = getCookie(event, SITE_AUTH_COOKIE)
  if (cookie === getSiteAuthToken(siteAuthUser, siteAuthPassword)) return

  if (path.startsWith('/api/')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return sendRedirect(event, `/login?redirect=${encodeURIComponent(path)}`)
})
