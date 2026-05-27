import { useState, type FormEvent, type ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

interface LoginResponse {
  accessToken: string
  user: { id: string; email: string; name: string; createdAt: string }
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const MATERIAL_BLUE = '#2196F3'

function LockPersonIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h7.26a6.995 6.995 0 0 1-.26-2H6V10h12v1c.7 0 1.37.1 2 .29V10c0-1.1-.9-2-2-2zm0 7c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 1.38c.59 0 1.06.47 1.06 1.06 0 .59-.47 1.06-1.06 1.06s-1.06-.47-1.06-1.06c0-.58.48-1.06 1.06-1.06zm0 4.62c-.78 0-1.45-.42-1.83-1.04.55-.32 1.18-.5 1.83-.5s1.27.18 1.83.5c-.38.62-1.05 1.04-1.83 1.04z" />
    </svg>
  )
}

function MoreVertIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  )
}

function VisibilityIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  )
}

function VisibilityOffIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16a3 3 0 0 0-3-3l-.17.01z" />
    </svg>
  )
}

function GoogleGLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
      <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.34-.18-1.97H10v3.73h5.39a4.6 4.6 0 0 1-2 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.29Z" />
      <path fill="#34A853" d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H1.06v2.59A10 10 0 0 0 10 20Z" />
      <path fill="#FBBC05" d="M4.4 11.9a6 6 0 0 1 0-3.8V5.51H1.06a10 10 0 0 0 0 8.98L4.4 11.9Z" />
      <path fill="#EA4335" d="M10 3.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.95.99 12.7 0 10 0A10 10 0 0 0 1.06 5.51L4.4 8.1C5.19 5.74 7.4 3.96 10 3.96Z" />
    </svg>
  )
}

function AppleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.43-1.09-.45-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.43C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`animate-spin ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeOpacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

interface FieldLabelProps {
  htmlFor: string
  children: ReactNode
  floated: boolean
  focused: boolean
  error: boolean
}

function FieldLabel({ htmlFor, children, floated, focused, error }: FieldLabelProps) {
  const color = error
    ? 'text-red-500'
    : focused
      ? 'text-[#2196F3]'
      : 'text-gray-500'

  const position = floated
    ? '-top-2 left-3 text-xs font-medium bg-white px-1'
    : 'top-1/2 -translate-y-1/2 left-3 text-base'

  return (
    <label
      htmlFor={htmlFor}
      className={`pointer-events-none absolute transition-all duration-150 ${position} ${color}`}
    >
      {children}
    </label>
  )
}

function getApiBaseUrl(): string {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
  return env?.VITE_API_URL ?? ''
}

export function LoginPage({ onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [networkToast, setNetworkToast] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const emailFloated = emailFocused || email.length > 0
  const passwordFloated = passwordFocused || password.length > 0

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAuthError(null)

    let valid = true
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('올바른 이메일 주소를 입력해주세요')
      valid = false
    } else {
      setEmailError(null)
    }
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요')
      valid = false
    } else {
      setPasswordError(null)
    }
    if (!valid) return

    setLoading(true)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.status === 401) {
        setAuthError('이메일 또는 비밀번호를 확인해주세요')
        return
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = (await res.json()) as LoginResponse
      try {
        window.localStorage.setItem('rorr.auth.token', data.accessToken)
      } catch {
        // storage may be unavailable (private mode); continue
      }
      signIn({ name: data.user.name, email: data.user.email })
      onSignedIn?.()
    } catch {
      setNetworkToast('네트워크 오류가 발생했습니다')
      window.setTimeout(() => setNetworkToast(null), 3500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#F5F5F5]">
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
        <button
          type="button"
          aria-label="Account"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3]"
        >
          <LockPersonIcon className="h-6 w-6" />
        </button>
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: MATERIAL_BLUE }}
        >
          Reliant
        </h1>
        <button
          type="button"
          onClick={onClose}
          aria-label="More options"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3]"
        >
          <MoreVertIcon className="h-6 w-6" />
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <section
          className="w-full max-w-[400px] rounded-lg bg-white p-6 sm:p-8"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          {authError && (
            <div
              role="alert"
              className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="relative mb-5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                placeholder={emailFloated ? 'name@company.com' : ''}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                disabled={loading}
                className={`block h-14 w-full rounded border bg-white px-3 pt-1 text-base text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#2196F3] disabled:bg-gray-50 ${
                  emailError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
              />
              <FieldLabel
                htmlFor="email"
                floated={emailFloated}
                focused={emailFocused}
                error={!!emailError}
              >
                Email Address
              </FieldLabel>
              {emailError && (
                <p className="mt-1 px-3 text-xs text-red-500">{emailError}</p>
              )}
            </div>

            <div className="mb-2 flex justify-end">
              <a
                href="#/forgot-password"
                className="text-xs font-medium hover:underline"
                style={{ color: MATERIAL_BLUE }}
              >
                Forgot Password?
              </a>
            </div>

            <div className="relative mb-5">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                placeholder={passwordFloated ? 'Enter your password' : ''}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                disabled={loading}
                className={`block h-14 w-full rounded border bg-white px-3 pr-12 pt-1 text-base text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#2196F3] disabled:bg-gray-50 ${
                  passwordError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
              />
              <FieldLabel
                htmlFor="password"
                floated={passwordFloated}
                focused={passwordFocused}
                error={!!passwordError}
              >
                Password
              </FieldLabel>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3]"
              >
                {showPassword ? (
                  <VisibilityOffIcon className="h-5 w-5" />
                ) : (
                  <VisibilityIcon className="h-5 w-5" />
                )}
              </button>
              {passwordError && (
                <p className="mt-1 px-3 text-xs text-red-500">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded bg-[#2196F3] text-base font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-[#1976D2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {loading ? (
                <Spinner className="h-5 w-5 text-white" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            <span>or</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded border border-gray-300 bg-white text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <GoogleGLogo />
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded bg-black text-base font-medium text-white transition-colors hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <AppleLogo />
              <span>Continue with Apple</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <a
              href="#/signup"
              className="font-bold hover:underline"
              style={{ color: MATERIAL_BLUE }}
            >
              Sign Up
            </a>
          </p>
        </section>
      </main>

      {networkToast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {networkToast}
        </div>
      )}
    </div>
  )
}
