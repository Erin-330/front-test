import type { ValidationFieldError } from './types'

export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const MIN_PASSWORD_LENGTH = 8

export function validateEmail(email: string): ValidationFieldError | null {
  if (!email) return { field: 'email', reason: 'required' }
  if (!EMAIL_REGEX.test(email))
    return { field: 'email', reason: 'invalid_email_format' }
  return null
}

export function validatePassword(
  password: string,
): ValidationFieldError | null {
  if (!password) return { field: 'password', reason: 'required' }
  if (password.length < MIN_PASSWORD_LENGTH)
    return { field: 'password', reason: 'password_too_short' }
  return null
}

export function validateLoginInput(
  email: string,
  password: string,
): ValidationFieldError[] {
  const errors: ValidationFieldError[] = []
  const emailError = validateEmail(email)
  if (emailError) errors.push(emailError)
  const passwordError = validatePassword(password)
  if (passwordError) errors.push(passwordError)
  return errors
}
