export interface LoginRequest {
  email: string
  password: string
  grant_type?: 'password'
}

export interface LoginUser {
  user_id: number
  email: string
  name: string
  profile_image?: string
}

export interface LoginSuccess {
  status: 'success'
  data: {
    access_token: string
    refresh_token: string
    expires_in: number
    user: LoginUser
  }
  message: string
}

export interface LoginError {
  status: 'error'
  code: string
  message: string
  errors?: { field: string; reason: string }[]
}

export type LoginResponse = LoginSuccess | LoginError

const FAILED_ATTEMPTS_KEY = 'rorr.auth.failedAttempts'
const LOCK_THRESHOLD = 5

function readFailedAttempts(email: string): number {
  try {
    const raw = window.localStorage.getItem(FAILED_ATTEMPTS_KEY)
    if (!raw) return 0
    const map = JSON.parse(raw) as Record<string, number>
    return map[email.toLowerCase()] ?? 0
  } catch {
    return 0
  }
}

function writeFailedAttempts(email: string, count: number) {
  try {
    const raw = window.localStorage.getItem(FAILED_ATTEMPTS_KEY)
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {}
    map[email.toLowerCase()] = count
    window.localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}

export function resetFailedAttempts(email: string) {
  writeFailedAttempts(email, 0)
}

export function getFailedAttempts(email: string): number {
  return readFailedAttempts(email)
}

export class LoginApiError extends Error {
  code: string
  httpStatus: number
  errors?: { field: string; reason: string }[]
  constructor(payload: LoginError, httpStatus: number) {
    super(payload.message)
    this.code = payload.code
    this.httpStatus = httpStatus
    this.errors = payload.errors
  }
}

// Mock backend behavior — used when no real `/api/v1/auth/login` endpoint is reachable.
async function mockLogin(req: LoginRequest): Promise<LoginSuccess> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(req.email)) {
    throw new LoginApiError(
      {
        status: 'error',
        code: 'VALID_001',
        message: '잘못된 이메일 형식입니다.',
        errors: [{ field: 'email', reason: 'invalid_email_format' }],
      },
      400,
    )
  }

  const attempts = readFailedAttempts(req.email)
  if (attempts >= LOCK_THRESHOLD) {
    throw new LoginApiError(
      {
        status: 'error',
        code: 'AUTH_LOCKED',
        message:
          '로그인 시도가 5회 이상 실패하여 계정이 잠겼습니다. 비밀번호 찾기를 진행해주세요.',
      },
      423,
    )
  }

  // Demo credentials: any email + password "Password!1" (or "password123!") succeeds.
  const isValid =
    req.password === 'Password!1' || req.password === 'password123!'

  if (!isValid) {
    writeFailedAttempts(req.email, attempts + 1)
    throw new LoginApiError(
      {
        status: 'error',
        code: 'AUTH_001',
        message: '이메일 또는 비밀번호가 일치하지 않습니다.',
      },
      401,
    )
  }

  resetFailedAttempts(req.email)

  return {
    status: 'success',
    data: {
      access_token: 'mock.' + btoa(req.email + ':' + Date.now()),
      refresh_token: 'mock_refresh_' + Date.now().toString(36),
      expires_in: 3600,
      user: {
        user_id: 12345,
        email: req.email,
        name: req.email.split('@')[0] || 'User',
        profile_image: undefined,
      },
    },
    message: '로그인에 성공했습니다.',
  }
}

export async function login(req: LoginRequest): Promise<LoginSuccess> {
  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req, grant_type: req.grant_type ?? 'password' }),
    })

    // If the real endpoint isn't deployed in this frontend-only project,
    // fall back to the mock implementation so the screen is testable.
    if (res.status === 404 || res.status === 0) {
      return mockLogin(req)
    }

    const payload = (await res.json()) as LoginResponse
    if (payload.status === 'success') {
      resetFailedAttempts(req.email)
      return payload
    }
    throw new LoginApiError(payload, res.status)
  } catch (err) {
    if (err instanceof LoginApiError) throw err
    // Network errors (offline, DNS, etc.) — fall back to the mock so the page works
    // in the demo environment, but rethrow if mock itself signals an auth error.
    return mockLogin(req)
  }
}

export const AUTH_TOKEN_KEY = 'rorr.auth.token'
