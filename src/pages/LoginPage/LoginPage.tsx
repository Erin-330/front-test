import { useMemo, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

type Toast = { kind: 'error' | 'info'; message: string }

export function LoginPage({ onClose: _onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const emailError = useMemo(() => {
    if (!submitted) return null
    if (!email) return 'Please enter your email.'
    if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address.'
    return null
  }, [email, submitted])

  const passwordError = useMemo(() => {
    if (!submitted) return null
    if (!password) return 'Please enter your password.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    return null
  }, [password, submitted])

  const showToast = (next: Toast) => {
    setToast(next)
    window.setTimeout(() => setToast(null), 3500)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    setSubmitted(true)
    setFormError(null)

    if (!EMAIL_REGEX.test(email) || password.length < 8) {
      return
    }

    setLoading(true)
    try {
      const apiUrl =
        (import.meta as ImportMeta & { env?: Record<string, string | undefined> })
          .env?.VITE_API_URL ?? ''
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.status === 401) {
        setFormError('이메일 또는 비밀번호를 확인해주세요')
        return
      }

      if (!res.ok) {
        showToast({
          kind: 'error',
          message: '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
        })
        return
      }

      const data = (await res.json().catch(() => ({}))) as {
        accessToken?: string
        user?: { name?: string; email?: string; picture?: string }
      }

      if (data.accessToken) {
        window.localStorage.setItem('accessToken', data.accessToken)
      }

      signIn(
        {
          name: data.user?.name ?? email.split('@')[0],
          email: data.user?.email ?? email,
          picture: data.user?.picture,
        },
        data.accessToken,
      )
      onSignedIn?.()
    } catch {
      showToast({
        kind: 'error',
        message: '네트워크 오류가 발생했습니다. 연결을 확인해주세요.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-azure-bg font-sans text-azure-ink">
      <header className="flex items-center justify-between border-b border-azure-border/60 bg-white px-4 py-3 sm:px-6">
        <span
          className="material-icons-outlined text-azure-primary"
          style={{ fontSize: 26 }}
          aria-hidden="true"
        >
          lock_person
        </span>
        <h1 className="text-[18px] font-bold tracking-tight text-azure-primary">
          Reliant
        </h1>
        <div className="relative">
          <button
            type="button"
            aria-label="More options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            onBlur={() => window.setTimeout(() => setMenuOpen(false), 120)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-azure-muted transition hover:bg-azure-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-primary/40"
          >
            <span
              className="material-icons-outlined"
              style={{ fontSize: 22 }}
              aria-hidden="true"
            >
              more_vert
            </span>
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-azure border border-azure-border bg-white py-1 shadow-azure-card"
            >
              <button
                role="menuitem"
                type="button"
                className="block w-full px-4 py-2 text-left text-[14px] text-azure-ink hover:bg-azure-bg"
              >
                Help
              </button>
              <button
                role="menuitem"
                type="button"
                className="block w-full px-4 py-2 text-left text-[14px] text-azure-ink hover:bg-azure-bg"
              >
                Privacy Policy
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:py-12">
        <section className="w-full max-w-[420px] rounded-azure bg-azure-surface px-6 py-8 shadow-azure-card sm:px-8 sm:py-10">
          <div className="mb-6">
            <h2 className="text-[24px] font-bold leading-tight text-azure-ink">
              Welcome back
            </h2>
            <p className="mt-1 text-[14px] text-azure-muted">
              Sign in to continue to Reliant.
            </p>
          </div>

          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FloatingTextField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={email}
              onChange={setEmail}
              error={emailError}
              disabled={loading}
            />

            <div>
              <div className="mb-1 flex items-center justify-end">
                <a
                  href="#/forgot-password"
                  className="text-[12px] font-medium text-azure-primary hover:underline focus:outline-none focus-visible:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <FloatingTextField
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                error={passwordError}
                disabled={loading}
                trailing={
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-azure-muted transition hover:text-azure-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-primary/40"
                  >
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: 20 }}
                      aria-hidden="true"
                    >
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                }
              />
            </div>

            {formError && (
              <p
                role="alert"
                className="text-[13px] font-medium"
                style={{ color: '#ba1a1a' }}
              >
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-azure bg-azure-primary px-4 text-[15px] font-semibold tracking-tight text-white transition hover:bg-azure-primary-hover active:bg-azure-primary-active focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Signing in…</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-azure-border" />
            <span className="text-[12px] font-medium uppercase tracking-wider text-azure-muted">
              or
            </span>
            <span className="h-px flex-1 bg-azure-border" />
          </div>

          <div className="flex flex-col gap-3">
            <GhostSocialButton
              label="Continue with Google"
              icon={<GoogleGlyph />}
              disabled={loading}
            />
            <GhostSocialButton
              label="Continue with Apple"
              icon={<AppleGlyph />}
              disabled={loading}
            />
          </div>

          <p className="mt-8 text-center text-[14px] text-azure-muted">
            Don&apos;t have an account?{' '}
            <a
              href="#/signup"
              className="font-semibold text-azure-primary hover:underline focus:outline-none focus-visible:underline"
            >
              Sign Up
            </a>
          </p>
        </section>
      </main>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
        >
          <div
            className="pointer-events-auto max-w-sm rounded-azure px-4 py-3 text-[13px] font-medium text-white shadow-azure-card"
            style={{ backgroundColor: toast.kind === 'error' ? '#ba1a1a' : '#1a1f2c' }}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}

interface FloatingTextFieldProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
  autoComplete?: string
  error?: string | null
  disabled?: boolean
  trailing?: React.ReactNode
}

function FloatingTextField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  disabled,
  trailing,
}: FloatingTextFieldProps) {
  const hasError = Boolean(error)
  const ringColor = hasError ? '#ba1a1a' : '#0052cc'

  return (
    <div className="w-full">
      <div className="relative">
        <label
          htmlFor={id}
          className="pointer-events-none absolute -top-2 left-3 z-10 bg-white px-1 text-[12px] font-medium"
          style={{ color: hasError ? '#ba1a1a' : '#5b6478' }}
        >
          {label}
        </label>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className="block h-12 w-full rounded-azure border bg-white px-3 pr-12 text-[15px] text-azure-ink placeholder-azure-muted/70 outline-none transition focus:border-transparent focus:ring-2 disabled:cursor-not-allowed disabled:bg-azure-bg disabled:text-azure-muted"
          style={
            {
              borderColor: hasError ? '#ba1a1a' : '#dfe3ec',
              ['--tw-ring-color' as const]: ringColor,
            } as React.CSSProperties
          }
        />
        {trailing && (
          <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>
        )}
      </div>
      {hasError && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-[12px] font-medium"
          style={{ color: '#ba1a1a' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

interface GhostSocialButtonProps {
  label: string
  icon: React.ReactNode
  disabled?: boolean
}

function GhostSocialButton({ label, icon, disabled }: GhostSocialButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-azure border border-azure-border bg-white px-4 text-[14px] font-semibold text-azure-ink transition hover:bg-azure-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center">{icon}</span>
      {label}
    </button>
  )
}

function Spinner() {
  return (
    <span
      role="status"
      aria-label="Loading"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
    />
  )
}

function GoogleGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.32A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.98 10.72A5.4 5.4 0 0 1 3.7 9c0-.6.1-1.18.28-1.72V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.02-2.32z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58A8.96 8.96 0 0 0 9 0 9 9 0 0 0 .96 4.96l3.02 2.32C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  )
}

function AppleGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#000"
        d="M14.42 13.86c-.27.62-.59 1.2-.97 1.73-.51.72-.93 1.22-1.25 1.5-.5.46-1.04.7-1.62.71-.41 0-.91-.12-1.49-.36-.58-.24-1.11-.36-1.6-.36-.51 0-1.06.12-1.65.36-.59.24-1.07.37-1.43.38-.55.02-1.1-.22-1.65-.73-.34-.3-.78-.82-1.31-1.56-.57-.79-1.04-1.7-1.41-2.74C.05 11.7-.1 10.66.07 9.66c.17-1.02.59-1.9 1.27-2.62.54-.58 1.2-1.03 1.99-1.36.79-.32 1.63-.49 2.52-.51.43 0 1 .13 1.71.39.71.26 1.16.39 1.36.39.15 0 .65-.15 1.5-.46.81-.28 1.49-.4 2.06-.36 1.53.12 2.68.73 3.45 1.82-1.37.83-2.05 1.99-2.04 3.48.01 1.16.43 2.12 1.26 2.89.37.36.79.63 1.26.83-.1.3-.21.59-.33.87-.15.32-.31.62-.49.93zM11.96.36c0 .79-.29 1.53-.86 2.21-.7.82-1.54 1.29-2.45 1.21a2.6 2.6 0 0 1-.02-.3c0-.76.33-1.57.91-2.23.29-.34.66-.62 1.11-.84.45-.21.87-.33 1.27-.35.01.1.04.2.04.3z"
      />
    </svg>
  )
}
