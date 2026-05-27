export interface LoginUser {
  user_id: number
  email: string
  name: string
  profile_image?: string
}

export interface LoginSuccessData {
  access_token: string
  refresh_token: string
  expires_in: number
  user: LoginUser
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginFieldError {
  field: string
  reason: string
}

export class LoginApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fields?: LoginFieldError[]

  constructor(opts: {
    status: number
    code: string
    message: string
    fields?: LoginFieldError[]
  }) {
    super(opts.message)
    this.name = 'LoginApiError'
    this.status = opts.status
    this.code = opts.code
    this.fields = opts.fields
  }
}

const DEMO_EMAIL = 'test@reliant.com'
const DEMO_PASSWORD = 'Password1!'

export async function login({
  email,
  password,
}: LoginRequest): Promise<LoginSuccessData> {
  await new Promise((r) => setTimeout(r, 900))

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return {
      access_token: 'demo.access.token',
      refresh_token: 'demo.refresh.token',
      expires_in: 3600,
      user: {
        user_id: 12345,
        email,
        name: 'Reliant 사용자',
      },
    }
  }

  throw new LoginApiError({
    status: 401,
    code: 'AUTH_001',
    message: '이메일 또는 비밀번호가 일치하지 않습니다.',
  })
}
