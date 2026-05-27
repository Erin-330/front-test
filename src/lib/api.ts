export interface ApiUser {
  user_id: number
  email: string
  name: string
  profile_image: string
}

export interface LoginSuccess {
  status: 'success'
  data: {
    access_token: string
    refresh_token: string
    expires_in: number
    user: ApiUser
  }
  message: string
}

export interface LoginError {
  status: 'error'
  code: string
  message: string
  errors?: Array<{ field: string; reason: string }>
}

export type LoginResponse = LoginSuccess | LoginError

const API_BASE =
  ((import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.VITE_API_URL as string | undefined) ?? ''

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, grant_type: 'password' }),
  })

  // The API always returns JSON for known status codes. Guard against an
  // unexpected HTML response (e.g. a misrouted 404) so callers get a clean
  // error instead of a parse exception.
  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return {
      status: 'error',
      code: 'NETWORK_ERROR',
      message: '서버에서 잘못된 응답을 받았습니다.',
    }
  }

  return (await res.json()) as LoginResponse
}

export const TOKEN_STORAGE_KEYS = {
  access: 'rorr.auth.access_token',
  refresh: 'rorr.auth.refresh_token',
} as const

export function persistTokens(tokens: { access_token: string; refresh_token: string }): void {
  window.localStorage.setItem(TOKEN_STORAGE_KEYS.access, tokens.access_token)
  window.localStorage.setItem(TOKEN_STORAGE_KEYS.refresh, tokens.refresh_token)
}
