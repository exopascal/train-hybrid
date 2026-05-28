function getEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required env var: ${key}`)
  return val
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  if (username !== getEnv('AUTH_USERNAME')) return false
  const hash = await sha256Hex(password)
  return hash === getEnv('AUTH_PASSWORD_HASH')
}

export async function createSessionToken(username: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getEnv('AUTH_SECRET')),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(username))
  const sigHex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${btoa(username)}.${sigHex}`
}

export async function validateSessionToken(token: string): Promise<boolean> {
  try {
    const dotIndex = token.indexOf('.')
    if (dotIndex === -1) return false
    const userB64 = token.slice(0, dotIndex)
    const username = atob(userB64)
    const expected = await createSessionToken(username)
    return expected === token && username === getEnv('AUTH_USERNAME')
  } catch {
    return false
  }
}
