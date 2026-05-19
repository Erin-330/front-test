import { useState, type FormEvent } from 'react'
import { Button } from '../Button'
import type { LoginFormValues, LoginPageProps } from './LoginPage.types'

interface FieldErrors {
  email?: string
  password?: string
}

function validate(values: LoginFormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.email) {
    errors.email = '이메일을 입력해주세요.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.'
  }
  if (!values.password) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (values.password.length < 6) {
    errors.password = '비밀번호는 6자 이상이어야 합니다.'
  }
  return errors
}

export function LoginPage({
  onSubmit,
  onSignUpClick,
  onForgotPasswordClick,
}: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = { email, password }
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    try {
      setSubmitting(true)
      await onSubmit?.(values)
    } finally {
      setSubmitting(false)
    }
  }

  const inputBase =
    'w-full h-11 px-3.5 rounded-md border bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0'
  const inputNormal = 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
  const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-200'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">로그인</h1>
            <p className="mt-2 text-sm text-gray-500">
              계정에 로그인하여 서비스를 이용해보세요.
            </p>
          </div>

          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <button
                  type="button"
                  onClick={onForgotPasswordClick}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  비밀번호 찾기
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`${inputBase} pr-16 ${errors.password ? inputError : inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                  className="absolute inset-y-0 right-2 my-auto h-7 px-2 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '숨기기' : '표시'}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full mt-1"
            >
              {submitting ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <button
              type="button"
              onClick={onSignUpClick}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
