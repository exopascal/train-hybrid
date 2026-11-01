import { createHash } from 'node:crypto'

export const SITE_AUTH_COOKIE = 'site_auth'

export function getSiteAuthToken(user: string, password: string) {
  return createHash('sha256').update(`${user}:${password}`).digest('hex')
}

export function getValidTokens(usersStr: string, password: string): string[] {
  return usersStr.split(',').map(u => u.trim()).filter(Boolean).map(u => getSiteAuthToken(u, password))
}
