import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

interface FormValues {
  email: string
  password: string
  rememberMe: boolean
}

interface FieldErrors {
  email?: string
  password?: string
}

function validateForm(values: FormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.email.trim()) {
    errors.email = '이메일을 입력해주세요.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.'
  }
  if (!values.password) {
    errors.password = '비밀번호를 입력해주세요.'
  } else if (values.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.'
  }
  return errors
}

async function mockLoginRequest(email: string): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, 1500))
  // Simulate auth failure for demo purposes
  if (email.toLowerCase() === 'fail@example.com') {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
  }
}

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

export function LoginPage() {
  const [values, setValues] = useState<FormValues>({ email: '', password: '', rememberMe: false })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (name === 'email' || name === 'password') {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }))
    }
    setServerError(null)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const errors = validateForm(values)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setLoading(true)
    setServerError(null)
    try {
      await mockLoginRequest(values.email)
      setSucceeded(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (succeeded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">로그인 성공!</h2>
          <p className="text-sm text-gray-500">환영합니다, {values.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-6"
            onClick={() => { setSucceeded(false); setValues({ email: '', password: '', rememberMe: false }) }}
          >
            돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
          <p className="mt-1 text-sm text-gray-500">계정에 로그인하세요</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Server error banner */}
            {serverError && (
              <div
                role="alert"
                className="flex items-start gap-3 p-3.5 rounded-lg bg-red-50 border border-red-200"
              >
                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            )}

            {/* Email field */}
            <Input
              label="이메일"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              value={values.email}
              onChange={handleChange}
              error={fieldErrors.email}
              disabled={loading}
              fullWidth
            />

            {/* Password field */}
            <Input
              label="비밀번호"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
              value={values.password}
              onChange={handleChange}
              error={fieldErrors.password}
              disabled={loading}
              fullWidth
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors duration-150"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              }
            />

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={values.rememberMe}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-600">로그인 상태 유지</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus-visible:underline transition-colors duration-150"
              >
                비밀번호 찾기
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-1"
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400 font-medium">또는</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus-visible:underline transition-colors duration-150"
            >
              회원가입
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          테스트: fail@example.com 입력 시 로그인 에러 시뮬레이션
        </p>
      </div>
    </div>
  )
}
