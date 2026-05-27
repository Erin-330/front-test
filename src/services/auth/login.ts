import type {
  LoginFailure,
  LoginRequest,
  LoginResponse,
  LoginSuccessData,
  LoginSuccessResponse,
} from './types'
import { validateLoginInput } from './validators'
import {
  clearLockout,
  getRemainingLockMs,
  isLocked,
  registerFailedAttempt,
} from './lockout'
import { saveTokens } from './tokenStore'

export const LOGIN_ENDPOINT = '/api/v1/auth/login'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginOptions {
  endpoint?: string
  fetchImpl?: typeof fetch
  signal?: AbortSignal
}

export type LoginResult =
  | { ok: true; data: LoginSuccessData }
  | { ok: false; failure: LoginFailure }

function isErrorResponse(
  body: LoginResponse,
): body is Extract<LoginResponse, { status: 'error' }> {
  return body.status === 'error'
}

function isSuccessResponse(
  body: LoginResponse,
): body is LoginSuccessResponse {
  return body.status === 'success'
}

export async function login(
  input: LoginInput,
  options: LoginOptions = {},
): Promise<LoginResult> {
  const email = input.email.trim()
  const password = input.password

  const validationErrors = validateLoginInput(email, password)
  if (validationErrors.length > 0) {
    const first = validationErrors[0]
    return {
      ok: false,
      failure: {
        kind: 'validation',
        code: 'VALID_001',
        message:
          first.field === 'email'
            ? '잘못된 이메일 형식입니다.'
            : '비밀번호는 최소 8자 이상이어야 합니다.',
        errors: validationErrors,
      },
    }
  }

  if (isLocked(email)) {
    return {
      ok: false,
      failure: {
        kind: 'account_locked',
        code: 'AUTH_002',
        message: '로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.',
        httpStatus: 423,
        errors: [
          {
            field: 'account',
            reason: `locked_for_${Math.ceil(getRemainingLockMs(email) / 1000)}s`,
          },
        ],
      },
    }
  }

  const body: LoginRequest = {
    email,
    password,
    grant_type: 'password',
  }

  const fetchImpl = options.fetchImpl ?? fetch
  const endpoint = options.endpoint ?? LOGIN_ENDPOINT

  let response: Response
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      signal: options.signal,
    })
  } catch {
    return {
      ok: false,
      failure: {
        kind: 'network',
        code: 'NET_001',
        message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
    }
  }

  let parsed: LoginResponse | null = null
  try {
    parsed = (await response.json()) as LoginResponse
  } catch {
    parsed = null
  }

  if (response.ok && parsed && isSuccessResponse(parsed)) {
    clearLockout(email)
    saveTokens({
      access_token: parsed.data.access_token,
      refresh_token: parsed.data.refresh_token,
      expires_at: Date.now() + parsed.data.expires_in * 1000,
    })
    return { ok: true, data: parsed.data }
  }

  if (parsed && isErrorResponse(parsed)) {
    if (response.status === 401) {
      const next = registerFailedAttempt(email)
      const locked = Boolean(next.lockedUntil)
      return {
        ok: false,
        failure: {
          kind: locked ? 'account_locked' : 'invalid_credentials',
          code: parsed.code,
          message: locked
            ? '로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.'
            : parsed.message,
          errors: parsed.errors,
          httpStatus: response.status,
        },
      }
    }
    return {
      ok: false,
      failure: {
        kind: response.status === 400 ? 'validation' : 'unknown',
        code: parsed.code,
        message: parsed.message,
        errors: parsed.errors,
        httpStatus: response.status,
      },
    }
  }

  return {
    ok: false,
    failure: {
      kind: 'unknown',
      code: 'UNKNOWN',
      message: '알 수 없는 오류가 발생했습니다.',
      httpStatus: response.status,
    },
  }
}
