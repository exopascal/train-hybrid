export function useSupabase() {
  const config = useRuntimeConfig()
  const url = String(config.supabaseUrl)
  const key = String(config.supabaseKey)
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
  return { url, headers }
}
