import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

const MOCK_USER = {
  name: 'Erin Kim',
  email: 'erin@rorr.club',
  picture: undefined,
}

function GoogleGLogo() {
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

function AppleLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
      fill="#111827"
    >
      <path d="M17.05 12.04c-.03-2.74 2.24-4.06 2.34-4.13-1.27-1.86-3.26-2.12-3.97-2.15-1.69-.17-3.3 1-4.16 1-.87 0-2.19-.97-3.6-.95-1.85.03-3.55 1.07-4.5 2.72-1.92 3.33-.49 8.25 1.39 10.95.92 1.32 2.01 2.8 3.44 2.75 1.38-.05 1.9-.89 3.58-.89s2.14.89 3.6.86c1.49-.03 2.43-1.34 3.34-2.67 1.05-1.53 1.49-3.01 1.51-3.09-.03-.01-2.9-1.11-2.93-4.4ZM14.32 4.07c.76-.92 1.27-2.2 1.13-3.47-1.09.04-2.42.73-3.21 1.65-.7.81-1.32 2.12-1.15 3.37 1.22.09 2.47-.62 3.23-1.55Z" />
    </svg>
  )
}

export function LoginPage({ onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const completeSignIn = () => {
    signIn(MOCK_USER)
    onSignedIn?.()
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    completeSignIn()
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="flex items-center justify-between border-b border-surface-border bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-trust-blue"
            style={{ fontSize: '24px' }}
            aria-hidden="true"
          >
            lock_person
          </span>
          <span className="text-[20px] font-bold tracking-tight text-trust-blue">
            Reliant
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue/40"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '22px' }}
            aria-hidden="true"
          >
            more_vert
          </span>
        </button>
      </header>

      <main className="flex flex-1 items-start justify-center bg-surface-alt px-4 py-6 sm:py-10">
        <section className="w-full max-w-[420px] rounded-lg bg-white p-6 shadow-card sm:p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-trust-blue-light">
            <span
              className="material-symbols-outlined text-trust-blue"
              style={{ fontSize: '24px' }}
              aria-hidden="true"
            >
              verified_user
            </span>
          </div>

          <h1 className="text-[26px] font-bold leading-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
            Securely sign in to manage your trusted
            <br />
            services and data.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-ink"
              >
                Email Address
              </label>
              <div className="group relative">
                <span
                  className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
                  style={{ fontSize: '20px' }}
                  aria-hidden="true"
                >
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="h-11 w-full rounded-md border border-surface-border bg-white pl-10 pr-3 text-[14px] text-ink placeholder:text-ink-subtle focus:border-trust-blue focus:outline-none focus:ring-1 focus:ring-trust-blue"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label
                  htmlFor="password"
                  className="block text-[13px] font-medium text-ink"
                >
                  Password
                </label>
                <a
                  href="#/forgot-password"
                  className="text-[12px] font-semibold text-trust-blue hover:underline focus:outline-none focus-visible:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span
                  className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
                  style={{ fontSize: '20px' }}
                  aria-hidden="true"
                >
                  key
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-11 w-full rounded-md border border-surface-border bg-white pl-10 pr-10 text-[14px] text-ink placeholder:text-ink-subtle focus:border-trust-blue focus:outline-none focus:ring-1 focus:ring-trust-blue"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-ink-subtle transition-colors hover:bg-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue/40"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '20px' }}
                    aria-hidden="true"
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-md bg-trust-blue text-[15px] font-semibold text-white transition-colors hover:bg-trust-blue-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue/40 focus-visible:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-surface-border" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
              or continue with
            </span>
            <div className="h-px flex-1 bg-surface-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={completeSignIn}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-surface-border bg-white text-[14px] font-medium text-ink transition-colors hover:bg-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue/40"
            >
              <GoogleGLogo />
              Google
            </button>
            <button
              type="button"
              onClick={completeSignIn}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-surface-border bg-white text-[14px] font-medium text-ink transition-colors hover:bg-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue/40"
            >
              <AppleLogo />
              Apple
            </button>
          </div>

          <p className="mt-6 text-center text-[13px] text-ink-muted">
            Don&apos;t have an account?{' '}
            <a
              href="#/signup"
              className="font-semibold text-trust-blue hover:underline focus:outline-none focus-visible:underline"
            >
              Sign Up
            </a>
          </p>
        </section>
      </main>
    </div>
  )
}
