import { useCallback, useEffect, useState } from 'react'

export interface AuthUser {
  id?: string
  name: string
  email: string
  picture?: string
  createdAt?: string
}

const USER_STORAGE_KEY = 'rorr.auth.user'
const TOKEN_STORAGE_KEY = 'rorr.auth.accessToken'

function readUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function readToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => readUser())
  const [accessToken, setAccessToken] = useState<string | null>(() => readToken())

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === USER_STORAGE_KEY) setUser(readUser())
      if (e.key === TOKEN_STORAGE_KEY) setAccessToken(readToken())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const signIn = useCallback((next: AuthUser, token?: string) => {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next))
    setUser(next)
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
      setAccessToken(token)
    }
  }, [])

  const signOut = useCallback(() => {
    window.localStorage.removeItem(USER_STORAGE_KEY)
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    setUser(null)
    setAccessToken(null)
  }, [])

  return { user, accessToken, signIn, signOut }
}
