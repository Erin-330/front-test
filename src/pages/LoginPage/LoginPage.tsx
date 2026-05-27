import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { GoogleLoginButton } from '../../components/GoogleLoginButton'
import { TopAppBar } from '../../components/TopAppBar'
import { Toast } from '../../components/Toast'
import { useAuth, type AuthUser } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const MAX_FAILED_ATTEMPTS = 5

interface LoginApiSuccess {
  status: 'success'
  data: {
    access_token: string
    refresh_token: string
    expires_in: number
    user: {
      user_id: number
      email: string
      name: string
      profile_image?: string
    }
  }
  message: string
}

interface LoginApiError {
  status: 'error'
  code: string
  message: string
  errors?: { field: string; reason: string }[]
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
          fill="currentColor"
        />
      </svg>
    )
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 4.27 3.28 3l17.73 17.73L19.74 22l-3.04-3.04A11.7 11.7 0 0 1 12 19C5 19 2 12 2 12a13.05 13.05 0 0 1 3.7-4.74L2 4.27Zm5.13 4.13A10.5 10.5 0 0 0 4.27 12s2.5 5 7.73 5c1.06 0 2.05-.2 2.95-.55l-1.6-1.6a4 4 0 0 1-5.48-5.48l-.74-.97ZM12 7c-.61 0-1.2.07-1.76.2L8.5 5.46A11.5 11.5 0 0 1 12 5c7 0 10 7 10 7a13.1 13.1 0 0 1-2.3 3.36l-1.43-1.43A10.7 10.7 0 0 0 19.73 12S17.23 7 12 7Zm-1.5 4.07 3.43 3.43A2 2 0 0 1 12 14a2 2 0 0 1-1.5-2.93Z"
        fill="currentColor"
      />
    </svg>
  )
}

function AppleLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M16.36 12.74c-.02-2.16 1.77-3.2 1.85-3.25-1.01-1.47-2.58-1.68-3.14-1.7-1.34-.13-2.61.79-3.29.79-.68 0-1.73-.77-2.84-.74a4.2 4.2 0 0 0-3.55 2.16C3.34 12.5 4.5 16.3 6 18.4c.73 1.02 1.6 2.17 2.74 2.13 1.1-.05 1.52-.71 2.85-.71 1.33 0 1.7.71 2.86.69 1.18-.02 1.92-1.04 2.64-2.07a9.13 9.13 0 0 0 1.19-2.42c-.03-.01-2.28-.87-2.92-3.28ZM14.18 6.34c.6-.73 1.01-1.74.9-2.74a4.06 4.06 0 0 0-2.62 1.36c-.57.66-1.07 1.7-.93 2.68 1.04.08 2.05-.53 2.65-1.3Z"
        fill="#000"
      />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1 5h2v7h-2Zm0 9h2v2h-2Z"
        fill="currentColor"
      />
    </svg>
  )
}

interface FieldProps {
  id: string
  label: string
  type: 'email' | 'password' | 'text'
  value: string
  onChange: (v: string) => void
  placeholder: string
  error?: string
  autoComplete?: string
  rightAdornment?: React.ReactNode
  onBlur?: () => void
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  rightAdornment,
  onBlur,
}: FieldProps) {
  const hasError = Boolean(error)
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className={`mb-1.5 text-[13px] font-medium ${
          hasError ? 'text-red-600' : 'text-gray-700'
        }`}
      >
        {label}
      </label>
      <div
        className={[
          'flex items-center rounded-md border bg-white transition-colors',
          'focus-within:ring-2 focus-within:ring-offset-0',
          hasError
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200'
            : 'border-gray-300 focus-within:border-[#1976D2] focus-within:ring-[#1976D2]/25',
        ].join(' ')}
      >
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className="h-11 w-full bg-transparent px-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        {rightAdornment ? <div className="pr-1">{rightAdornment}</div> : null}
      </div>
      {hasError && (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600"
        >
          <ErrorIcon />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

export function LoginPage({ onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const submittingRef = useRef(false)

  const canSubmit = useMemo(
    () =>
      email.trim().length > 0 &&
      password.length > 0 &&
      !submitting &&
      failedAttempts < MAX_FAILED_ATTEMPTS,
    [email, password, submitting, failedAttempts],
  )

  const validateEmail = useCallback((value: string) => {
    if (!value.trim()) return '이메일을 입력해주세요.'
    if (!EMAIL_REGEX.test(value.trim())) return '잘못된 이메일 형식입니다.'
    return null
  }, [])

  const validatePassword = useCallback((value: string) => {
    if (!value) return '비밀번호를 입력해주세요.'
    if (value.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
    return null
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submittingRef.current) return

    const emailMsg = validateEmail(email)
    const pwMsg = validatePassword(password)
    setEmailError(emailMsg)
    setPasswordError(pwMsg)
    setFormError(null)
    if (emailMsg || pwMsg) return

    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      setFormError(
        '5회 이상 로그인에 실패했습니다. 잠시 후 다시 시도하거나 비밀번호 찾기를 이용해주세요.',
      )
      return
    }

    submittingRef.current = true
    setSubmitting(true)

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          grant_type: 'password',
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | LoginApiSuccess
        | LoginApiError
        | null

      if (response.ok && payload && payload.status === 'success') {
        const user: AuthUser = {
          name: payload.data.user.name,
          email: payload.data.user.email,
          picture: payload.data.user.profile_image,
        }
        signIn(user)
        setFailedAttempts(0)
        onSignedIn?.()
        return
      }

      if (response.status === 400 && payload && payload.status === 'error') {
        const fieldErr = payload.errors?.find((x) => x.field === 'email')
        if (fieldErr) {
          setEmailError(payload.message || '잘못된 이메일 형식입니다.')
        } else {
          setFormError(payload.message || '입력값을 확인해주세요.')
        }
        return
      }

      if (response.status === 401) {
        const next = failedAttempts + 1
        setFailedAttempts(next)
        if (next >= MAX_FAILED_ATTEMPTS) {
          setFormError(
            '5회 이상 로그인에 실패했습니다. 잠시 후 다시 시도하거나 비밀번호 찾기를 이용해주세요.',
          )
        } else {
          setFormError('이메일 또는 비밀번호를 확인해주세요.')
        }
        return
      }

      setFormError(
        (payload && 'message' in payload && payload.message) ||
          '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
      )
    } catch {
      setToast('네트워크 오류가 발생했습니다. 연결 상태를 확인해주세요.')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn({ name: 'Google User', email: email || 'user@gmail.com' })
    onSignedIn?.()
  }

  const handleAppleSignIn = () => {
    signIn({ name: 'Apple User', email: email || 'user@icloud.com' })
    onSignedIn?.()
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <TopAppBar
        title="Reliant"
        onMore={(action) => {
          if (action === 'help') setToast('도움말은 준비 중입니다.')
          if (action === 'about') setToast('Reliant v1.0.0')
        }}
      />

      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:py-12">
        <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-[22px] font-semibold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-1 text-[14px] text-gray-500">
              Sign in to continue to Reliant
            </p>
          </div>

          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <Field
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(v) => {
                setEmail(v)
                if (emailError) setEmailError(null)
                if (formError) setFormError(null)
              }}
              onBlur={() => setEmailError(validateEmail(email))}
              placeholder="name@company.com"
              autoComplete="email"
              error={emailError ?? undefined}
            />

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span
                  className={`text-[13px] font-medium ${
                    passwordError ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  Password
                </span>
                <a
                  href="#/forgot-password"
                  className="text-[12px] font-medium text-[#1976D2] hover:underline focus:outline-none focus-visible:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div
                className={[
                  'flex items-center rounded-md border bg-white transition-colors',
                  'focus-within:ring-2',
                  passwordError
                    ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200'
                    : 'border-gray-300 focus-within:border-[#1976D2] focus-within:ring-[#1976D2]/25',
                ].join(' ')}
              >
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) setPasswordError(null)
                    if (formError) setFormError(null)
                  }}
                  onBlur={() => setPasswordError(validatePassword(password))}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={
                    passwordError ? 'password-error' : undefined
                  }
                  className="h-11 w-full bg-transparent px-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  aria-pressed={showPassword}
                  className="mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]/40"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {passwordError && (
                <p
                  id="password-error"
                  className="mt-1.5 flex items-center gap-1 text-[12px] text-red-600"
                >
                  <ErrorIcon />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {formError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-700 ring-1 ring-red-200"
              >
                <ErrorIcon />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              aria-busy={submitting}
              className={[
                'mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-md text-[15px] font-semibold text-white',
                'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]/40 focus-visible:ring-offset-2',
                canSubmit
                  ? 'bg-[#1976D2] hover:bg-[#1565C0] active:bg-[#0D47A1]'
                  : 'cursor-not-allowed bg-gray-300',
              ].join(' ')}
            >
              {submitting && (
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              <span>{submitting ? 'Signing in…' : 'Sign In'}</span>
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-400">
              or
            </span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="flex flex-col gap-3">
            <GoogleLoginButton
              onClick={handleGoogleSignIn}
              className="w-full"
            />
            <button
              type="button"
              onClick={handleAppleSignIn}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[30px] border border-gray-300 bg-white px-6 py-3 text-base font-bold text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
            >
              <AppleLogo />
              <span>Sign in with Apple</span>
            </button>
          </div>

          <p className="mt-6 text-center text-[14px] text-gray-600">
            Don&apos;t have an account?{' '}
            <a
              href="#/signup"
              className="font-semibold text-[#1976D2] hover:underline focus:outline-none focus-visible:underline"
            >
              Sign Up
            </a>
          </p>
        </section>
      </main>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
