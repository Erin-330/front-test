import { useState, type FormEvent } from 'react'
import { Button } from '../Button'
import type { LoginFormErrors, LoginFormValues, LoginProps } from './Login.types'
import { hasErrors, validateLogin } from './validation'

const initialValues: LoginFormValues = { email: '', password: '' }

export function Login({ onSubmit }: LoginProps) {
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [touched, setTouched] = useState<Record<keyof LoginFormValues, boolean>>({
    email: false,
    password: false,
  })
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field: keyof LoginFormValues) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    if (touched[field]) {
      setErrors(validateLogin(next))
    }
  }

  const markTouched = (field: keyof LoginFormValues) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validateLogin(values))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    const nextErrors = validateLogin(values)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    try {
      setSubmitting(true)
      if (onSubmit) {
        await onSubmit({ email: values.email.trim(), password: values.password })
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600))
        alert(`로그인 성공: ${values.email.trim()}`)
      }
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : '로그인에 실패했습니다.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field: keyof LoginFormValues) =>
    [
      'w-full h-10 px-3 rounded-md border bg-white text-sm text-gray-900',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      errors[field]
        ? 'border-red-500 focus-visible:ring-red-500'
        : 'border-gray-300 focus-visible:ring-blue-500',
    ].join(' ')

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-sm flex flex-col gap-4 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold text-gray-900">로그인</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={updateField('email')}
          onBlur={markTouched('email')}
          disabled={submitting}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          className={inputClass('email')}
        />
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={updateField('password')}
          onBlur={markTouched('password')}
          disabled={submitting}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          className={inputClass('password')}
        />
        {errors.password && (
          <p id="login-password-error" role="alert" className="text-xs text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      {errors.form && (
        <p role="alert" className="text-sm text-red-600">
          {errors.form}
        </p>
      )}

      <Button type="submit" variant="primary" loading={submitting}>
        {submitting ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  )
}
