export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export interface ValidationError {
  field: string
  reason: string
}

export interface LoginPayload {
  email: string
  password: string
  grant_type?: string
}

export function validateLoginPayload(body: unknown): {
  payload?: LoginPayload
  errors: ValidationError[]
  firstMessage?: string
} {
  const errors: ValidationError[] = []

  if (!body || typeof body !== 'object') {
    return {
      errors: [{ field: 'body', reason: 'missing_request_body' }],
      firstMessage: '요청 본문이 비어 있습니다.',
    }
  }

  const { email, password, grant_type } = body as Record<string, unknown>

  if (typeof email !== 'string' || email.length === 0) {
    errors.push({ field: 'email', reason: 'required' })
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', reason: 'invalid_email_format' })
  }

  if (typeof password !== 'string' || password.length === 0) {
    errors.push({ field: 'password', reason: 'required' })
  } else if (password.length < 8) {
    errors.push({ field: 'password', reason: 'password_too_short' })
  }

  if (errors.length > 0) {
    const first = errors[0]
    const message =
      first.reason === 'invalid_email_format'
        ? '잘못된 이메일 형식입니다.'
        : first.reason === 'password_too_short'
          ? '비밀번호는 최소 8자 이상이어야 합니다.'
          : '필수 입력값이 누락되었습니다.'
    return { errors, firstMessage: message }
  }

  return {
    payload: {
      email: email as string,
      password: password as string,
      grant_type: typeof grant_type === 'string' ? grant_type : undefined,
    },
    errors: [],
  }
}
