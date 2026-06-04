import { useCallback, useEffect, useState } from 'react'

function currentPath() {
  if (typeof window === 'undefined') return '/'
  const hash = window.location.hash.replace(/^#/, '')
  return hash || '/'
}

export function useHashRoute(): [string, (next: string) => void] {
  const [path, setPath] = useState<string>(() => currentPath())

  useEffect(() => {
    const onHashChange = () => setPath(currentPath())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((next: string) => {
    window.location.hash = next
    setPath(next || '/')
  }, [])

  return [path, navigate]
}
