import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

type FieldErrors = {
  email?: string
  password?: string
}

export function LoginPage({ onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!email) {
      next.email = '이메일을 입력해주세요'
    } else if (!EMAIL_REGEX.test(email)) {
      next.email = '올바른 이메일 형식이 아닙니다'
    }
    if (!password) {
      next.password = '비밀번호를 입력해주세요'
    } else if (password.length < 8) {
      next.password = '비밀번호는 최소 8자 이상이어야 합니다'
    }
    return next
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoading) return

    setServerError(null)
    const fieldErrors = validate()
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.status === 401) {
        setServerError('이메일 또는 비밀번호를 확인해주세요')
        return
      }

      if (!res.ok) {
        setServerError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요')
        return
      }

      const data = (await res.json().catch(() => ({}))) as {
        name?: string
        email?: string
        picture?: string
      }

      signIn({
        name: data.name ?? email.split('@')[0],
        email: data.email ?? email,
        picture: data.picture,
      })
      onSignedIn?.()
    } catch {
      setServerError('네트워크 오류가 발생했습니다. 다시 시도해주세요')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = (provider: 'google' | 'apple') => {
    if (isLoading) return
    signIn({
      name: provider === 'google' ? 'Google User' : 'Apple User',
      email: provider === 'google' ? 'user@gmail.com' : 'user@privaterelay.appleid.com',
    })
    onSignedIn?.()
  }

  return (
    <div className="min-h-screen bg-clarity-surface font-sans text-clarity-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-clarity-surface">
        <Header />

        <main className="flex flex-1 flex-col px-6 pb-8 pt-2">
          <BrandMark />

          <h1 className="mt-4 text-[28px] font-bold leading-tight tracking-tight text-clarity-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-clarity-ink-muted">
            Securely sign in to manage your trusted
            <br />
            services and data.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[13px] font-semibold text-clarity-ink"
              >
                Email Address
              </label>
              <div
                className={`flex h-12 items-center gap-2 rounded-lg border bg-white px-3 transition-colors focus-within:border-clarity-primary ${
                  errors.email
                    ? 'border-clarity-danger'
                    : 'border-clarity-border'
                }`}
              >
                <EnvelopeIcon className="h-5 w-5 text-clarity-ink-subtle" />
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={isLoading}
                  className="h-full flex-1 bg-transparent text-[14px] text-clarity-ink placeholder:text-clarity-ink-subtle focus:outline-none disabled:opacity-60"
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  className="text-[12px] font-medium text-clarity-danger"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[13px] font-semibold text-clarity-ink"
                >
                  Password
                </label>
                <a
                  href="#/forgot-password"
                  className="text-[13px] font-semibold text-clarity-primary hover:underline focus:outline-none focus-visible:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div
                className={`flex h-12 items-center gap-2 rounded-lg border bg-white px-3 transition-colors focus-within:border-clarity-primary ${
                  errors.password
                    ? 'border-clarity-danger'
                    : 'border-clarity-border'
                }`}
              >
                <KeyIcon className="h-5 w-5 text-clarity-ink-subtle" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password)
                      setErrors({ ...errors, password: undefined })
                  }}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                  disabled={isLoading}
                  className="h-full flex-1 bg-transparent text-[14px] text-clarity-ink placeholder:text-clarity-ink-subtle focus:outline-none disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-clarity-ink-subtle hover:text-clarity-ink-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-clarity-primary"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-[12px] font-medium text-clarity-danger"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {serverError && (
              <div
                role="alert"
                className="rounded-md border border-clarity-danger/30 bg-clarity-danger/5 px-3 py-2 text-[13px] text-clarity-danger"
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-clarity-primary text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-clarity-primary-hover active:bg-clarity-primary-pressed focus:outline-none focus-visible:ring-2 focus-visible:ring-clarity-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading && <Spinner className="h-4 w-4" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-clarity-border" />
            <span className="text-[11px] font-semibold tracking-[0.12em] text-clarity-ink-subtle">
              OR CONTINUE WITH
            </span>
            <span className="h-px flex-1 bg-clarity-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignIn('google')}
              disabled={isLoading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-clarity-border bg-white text-[14px] font-semibold text-clarity-ink transition-colors hover:bg-clarity-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-clarity-primary disabled:opacity-50"
            >
              <GoogleGLogo className="h-5 w-5" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignIn('apple')}
              disabled={isLoading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-clarity-border bg-white text-[14px] font-semibold text-clarity-ink transition-colors hover:bg-clarity-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-clarity-primary disabled:opacity-50"
            >
              <AppleLogo className="h-5 w-5" />
              <span>Apple</span>
            </button>
          </div>

          <p className="mt-6 text-center text-[13px] text-clarity-ink-muted">
            Don&apos;t have an account?{' '}
            <a
              href="#/signup"
              className="font-semibold text-clarity-primary hover:underline focus:outline-none focus-visible:underline"
            >
              Sign Up
            </a>
          </p>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="flex items-center justify-between px-6 pt-5">
      <div className="flex items-center gap-1.5 text-clarity-primary">
        <ShieldLogoIcon className="h-5 w-5" />
        <span className="text-[18px] font-bold tracking-tight">Reliant</span>
      </div>
      <button
        type="button"
        aria-label="More options"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-clarity-ink-muted shadow-sm hover:bg-clarity-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-clarity-primary"
      >
        <DotsVerticalIcon className="h-4 w-4" />
      </button>
    </header>
  )
}

function BrandMark() {
  return (
    <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-clarity-primary/10 text-clarity-primary">
      <ShieldFilledIcon className="h-6 w-6" />
    </div>
  )
}

function BottomNav() {
  return (
    <nav className="flex items-center justify-around border-t border-clarity-border bg-white px-4 py-2 pb-3">
      <NavItem label="Sign In" active>
        <ArrowRightCircleIcon className="h-5 w-5" />
      </NavItem>
      <NavItem label="Help">
        <HelpCircleIcon className="h-5 w-5" />
      </NavItem>
      <NavItem label="Security">
        <ShieldOutlineIcon className="h-5 w-5" />
      </NavItem>
    </nav>
  )
}

function NavItem({
  label,
  active = false,
  children,
}: {
  label: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-[11px] font-semibold transition-colors ${
        active
          ? 'bg-clarity-primary text-white'
          : 'text-clarity-ink-muted hover:text-clarity-ink'
      }`}
    >
      {children}
      <span>{label}</span>
    </button>
  )
}

function ShieldLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2.5 4 5.5v6c0 4.5 3.4 8.7 8 10 4.6-1.3 8-5.5 8-10v-6l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.5 11 14l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShieldFilledIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2.5 4 5.5v6c0 4.5 3.4 8.7 8 10 4.6-1.3 8-5.5 8-10v-6l-8-3Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M12 2.5 4 5.5v6c0 4.5 3.4 8.7 8 10 4.6-1.3 8-5.5 8-10v-6l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShieldOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3 5 5.5v5.7c0 4.2 2.9 8.1 7 9.3 4.1-1.2 7-5.1 7-9.3V5.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DotsVerticalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  )
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5.5"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M11.5 12H21M18 12v3M15 12v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 3l18 18M10.6 6.2A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.1 3.8M6.1 7.6C3.7 9.4 2.5 12 2.5 12s3.5 6 9.5 6c1.5 0 2.8-.4 4-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9.6 9.7a3 3 0 0 0 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`${className ?? ''} animate-spin`}
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
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
      />
    </svg>
  )
}

function GoogleGLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.68-.06-1.34-.18-1.97H10v3.73h5.39a4.6 4.6 0 0 1-2 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.29Z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H1.06v2.59A10 10 0 0 0 10 20Z"
      />
      <path
        fill="#FBBC05"
        d="M4.4 11.9a6 6 0 0 1 0-3.8V5.51H1.06a10 10 0 0 0 0 8.98L4.4 11.9Z"
      />
      <path
        fill="#EA4335"
        d="M10 3.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.95.99 12.7 0 10 0A10 10 0 0 0 1.06 5.51L4.4 8.1C5.19 5.74 7.4 3.96 10 3.96Z"
      />
    </svg>
  )
}

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M13.6 10.6c0-2 1.6-2.95 1.67-3-.91-1.33-2.33-1.52-2.83-1.54-1.21-.12-2.36.71-2.98.71-.62 0-1.57-.69-2.58-.67-1.33.02-2.55.77-3.23 1.96-1.38 2.39-.35 5.92.99 7.86.66.95 1.43 2.01 2.45 1.97.98-.04 1.35-.63 2.54-.63s1.52.63 2.57.61c1.06-.02 1.73-.96 2.38-1.91.75-1.1 1.06-2.17 1.08-2.23-.02-.01-2.07-.79-2.06-3.13Zm-2.02-5.74c.55-.66.92-1.59.82-2.51-.79.03-1.74.53-2.31 1.19-.51.58-.96 1.51-.84 2.42.88.07 1.78-.45 2.33-1.1Z" />
    </svg>
  )
}

function ArrowRightCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m11 8 4 4-4 4M8 12h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HelpCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.6 9a2.5 2.5 0 0 1 4.9.7c0 1.5-2 1.8-2 3.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12.5" cy="16.5" r="1" fill="currentColor" />
    </svg>
  )
}
