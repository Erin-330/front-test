import { useEffect, useState } from 'react'

export interface UserDetail {
  id: string
  name: string
  email: string
  profileImage: string | null
  createdAt: string
}

export type UserDetailErrorKind =
  | 'unauthorized'
  | 'not-found'
  | 'network'
  | 'unknown'

export interface UserDetailError {
  kind: UserDetailErrorKind
  message: string
}

export interface UserDetailState {
  status: 'idle' | 'loading' | 'success' | 'error'
  data: UserDetail | null
  error: UserDetailError | null
}

const TOKEN_STORAGE_KEY = 'rorr.auth.token'

function readToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

function apiBase(): string {
  const fromEnv =
    typeof import.meta !== 'undefined'
      ? (import.meta as unknown as { env?: Record<string, string> }).env
          ?.VITE_API_BASE_URL
      : undefined
  return fromEnv ?? ''
}

export function useUserDetail(id: string | null): UserDetailState {
  const [state, setState] = useState<UserDetailState>({
    status: id ? 'loading' : 'idle',
    data: null,
    error: null,
  })

  useEffect(() => {
    if (!id) {
      setState({ status: 'idle', data: null, error: null })
      return
    }

    const token = readToken()
    if (!token) {
      setState({
        status: 'error',
        data: null,
        error: { kind: 'unauthorized', message: '로그인이 필요합니다.' },
      })
      return
    }

    const controller = new AbortController()
    setState({ status: 'loading', data: null, error: null })

    fetch(`${apiBase()}/users/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          setState({
            status: 'error',
            data: null,
            error: {
              kind: 'unauthorized',
              message: '인증이 만료되었습니다. 다시 로그인해 주세요.',
            },
          })
          return
        }
        if (res.status === 404) {
          setState({
            status: 'error',
            data: null,
            error: {
              kind: 'not-found',
              message: '사용자를 찾을 수 없습니다.',
            },
          })
          return
        }
        if (!res.ok) {
          setState({
            status: 'error',
            data: null,
            error: {
              kind: 'unknown',
              message: `요청에 실패했습니다. (${res.status})`,
            },
          })
          return
        }
        const data = (await res.json()) as UserDetail
        setState({ status: 'success', data, error: null })
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setState({
          status: 'error',
          data: null,
          error: {
            kind: 'network',
            message: '네트워크 오류가 발생했습니다.',
          },
        })
      })

    return () => controller.abort()
  }, [id])

  return state
}
