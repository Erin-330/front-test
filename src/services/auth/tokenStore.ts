const STORAGE_KEY = 'rorr.auth.tokens'

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_at: number
}

export function saveTokens(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

export function readTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthTokens) : null
  } catch {
    return null
  }
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
