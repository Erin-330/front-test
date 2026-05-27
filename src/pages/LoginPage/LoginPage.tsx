import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function MaterialIcon({
  name,
  className = '',
  size = 20,
}: {
  name: string
  className?: string
  size?: number
}) {
  return (
    <span
      className={`material-icons leading-none select-none ${className}`}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}

function GoogleGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
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

function AppleGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
      fill="#0b1220"
    >
      <path d="M16.365 1.43c0 1.14-.43 2.21-1.21 2.99-.77.78-2 1.36-3.07 1.27-.13-1.13.43-2.3 1.18-3.04.84-.83 2.21-1.39 3.1-1.22Zm3.93 17.06c-.61 1.4-.91 2.03-1.7 3.27-1.1 1.73-2.65 3.89-4.58 3.9-1.71.02-2.15-1.11-4.47-1.1-2.32.01-2.8 1.12-4.51 1.1-1.92-.02-3.39-1.96-4.5-3.69C-2.06 16.83-2.42 9 2.7 5.93c1.5-.9 3.27-1.31 4.83-1.31 1.78 0 2.9 1.06 4.36 1.06 1.42 0 2.29-1.06 4.34-1.06 1.55 0 3.19.86 4.34 2.32-3.81 2.09-3.2 7.55.7 9.55Z" />
    </svg>
  )
}

export function LoginPage({ onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    if (!EMAIL_REGEX.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요')
      return
    }
    if (password.length < 1) {
      setError('비밀번호를 입력해주세요')
      return
    }

    setError(null)
    setLoading(true)

    const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 401) {
        setError('이메일 또는 비밀번호를 확인해주세요')
        return
      }
      if (!response.ok) {
        setError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.')
        return
      }

      const data = (await response.json().catch(() => ({}))) as {
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
      setError('네트워크 오류가 발생했습니다. 연결을 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-white text-clarity-ink">
      <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col">
        {/* AppBar */}
        <header className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MaterialIcon
              name="lock_person"
              size={24}
              className="text-clarity-primary"
            />
            <span className="text-[18px] font-bold tracking-tight text-clarity-primary">
              Reliant
            </span>
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="More options"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-clarity-surface-muted text-clarity-ink-muted transition-colors hover:bg-clarity-border focus:outline-none focus-visible:ring-2 focus-visible:ring-clarity-primary/30"
            >
              <MaterialIcon name="more_vert" size={20} />
            </button>
            {menuOpen && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onClose?.()
                }}
                className="absolute right-0 top-11 z-10 rounded-lg border border-clarity-border bg-white px-4 py-2 text-sm text-clarity-ink shadow-lg"
              >
                Close
              </button>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="px-6 pt-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-clarity-primary-soft">
            <MaterialIcon
              name="shield_person"
              size={26}
              className="text-clarity-primary"
            />
          </div>
          <h1 className="mt-5 text-[28px] font-extrabold leading-tight tracking-tight text-clarity-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-[15px] leading-snug text-clarity-ink-muted">
            Securely sign in to manage your trusted services and data.
          </p>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col px-6" noValidate>
          {/* Email */}
          <label
            htmlFor="email"
            className="text-[14px] font-semibold text-clarity-ink"
          >
            Email Address
          </label>
          <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-clarity-border bg-white px-3 transition-colors focus-within:border-clarity-primary focus-within:ring-2 focus-within:ring-clarity-primary/20">
            <MaterialIcon
              name="mail_outline"
              size={20}
              className="text-clarity-ink-subtle"
            />
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="h-full w-full bg-transparent text-[15px] text-clarity-ink placeholder:text-clarity-ink-subtle focus:outline-none"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mt-4 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[14px] font-semibold text-clarity-ink"
            >
              Password
            </label>
            <a
              href="#/forgot"
              className="text-[14px] font-semibold text-clarity-primary hover:underline focus:outline-none focus-visible:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-clarity-border bg-white px-3 transition-colors focus-within:border-clarity-primary focus-within:ring-2 focus-within:ring-clarity-primary/20">
            <MaterialIcon
              name="vpn_key"
              size={20}
              className="text-clarity-ink-subtle"
            />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-full w-full bg-transparent text-[15px] text-clarity-ink placeholder:text-clarity-ink-subtle focus:outline-none"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-clarity-ink-muted hover:text-clarity-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-clarity-primary/30"
            >
              <MaterialIcon
                name={showPassword ? 'visibility_off' : 'visibility'}
                size={20}
              />
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 text-[13px] font-medium text-clarity-danger"
            >
              {error}
            </p>
          )}

          {/* Sign In button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-clarity-primary text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-clarity-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-clarity-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
                Signing in…
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-clarity-border" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-clarity-ink-subtle">
              Or continue with
            </span>
            <span className="h-px flex-1 bg-clarity-border" />
          </div>

          {/* Social */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-clarity-border bg-white text-[14px] font-semibold text-clarity-ink transition-colors hover:bg-clarity-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-clarity-primary/30"
            >
              <GoogleGlyph />
              Google
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-clarity-border bg-white text-[14px] font-semibold text-clarity-ink transition-colors hover:bg-clarity-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-clarity-primary/30"
            >
              <AppleGlyph />
              Apple
            </button>
          </div>

          {/* Sign up */}
          <p className="mt-6 text-center text-[14px] text-clarity-ink-muted">
            Don&apos;t have an account?{' '}
            <a
              href="#/signup"
              className="font-semibold text-clarity-primary hover:underline focus:outline-none focus-visible:underline"
            >
              Sign Up
            </a>
          </p>
        </form>

        <div className="flex-1" />

        {/* Bottom nav */}
        <nav className="border-t border-clarity-border bg-white px-4 pb-4 pt-2">
          <ul className="grid grid-cols-3 gap-2">
            <li>
              <button
                type="button"
                className="flex w-full flex-col items-center gap-1 rounded-lg bg-clarity-primary px-2 py-2 text-white"
              >
                <MaterialIcon name="login" size={22} />
                <span className="text-[12px] font-semibold">Sign In</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full flex-col items-center gap-1 rounded-lg px-2 py-2 text-clarity-ink-muted hover:text-clarity-ink"
              >
                <MaterialIcon name="help_outline" size={22} />
                <span className="text-[12px] font-medium">Help</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full flex-col items-center gap-1 rounded-lg px-2 py-2 text-clarity-ink-muted hover:text-clarity-ink"
              >
                <MaterialIcon name="shield" size={22} />
                <span className="text-[12px] font-medium">Security</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
