import { validateSessionToken } from '../utils/auth'

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout']
const PUBLIC_PREFIXES = ['/_nuxt/', '/favicon', '/train-hybrid-logo', '/icons/']

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (PUBLIC_PATHS.includes(path)) return
  if (PUBLIC_PREFIXES.some(p => path.startsWith(p))) return

  const cookie = getCookie(event, 'auth_session')
  if (cookie && (await validateSessionToken(cookie))) return

  return sendRedirect(event, '/login', 302)
})
