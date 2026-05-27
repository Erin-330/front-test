import { useCallback, useEffect, useState } from 'react'

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

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setUser(readUser())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const signIn = useCallback((next: AuthUser, accessToken?: string) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    if (accessToken) {
      window.localStorage.setItem('accessToken', accessToken)
    }
    setUser(next)
  }, [])

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  return { user, signIn, signOut }
}
