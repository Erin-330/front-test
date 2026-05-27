import { useCallback, useEffect, useState } from 'react'
import { clearTokens, readTokens } from '../services/auth'
import type { AuthTokens } from '../services/auth'

export interface AuthUser {
  name: string
  email: string
  picture?: string
}

const STORAGE_KEY = 'rorr.auth.user'

function readUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => readUser())
  const [tokens, setTokens] = useState<AuthTokens | null>(() => readTokens())

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setUser(readUser())
      if (e.key === 'rorr.auth.tokens') setTokens(readTokens())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const signIn = useCallback((next: AuthUser) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setUser(next)
    setTokens(readTokens())
  }, [])

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    clearTokens()
    setUser(null)
    setTokens(null)
  }, [])

  return { user, tokens, signIn, signOut }
}
