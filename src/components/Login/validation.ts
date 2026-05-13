import type { LoginFormErrors, LoginFormValues } from './Login.types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {}

  const email = values.email.trim()
  if (!email) {
    errors.email = '이메일을 입력해주세요.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.'
  }

  if (!values.password) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (values.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.'
  }

  return errors
}

export function hasErrors(errors: LoginFormErrors): boolean {
  return Object.values(errors).some(Boolean)
}
