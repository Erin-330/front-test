import { useState, type FormEvent } from 'react'
import { OutlinedTextField } from '../../components/OutlinedTextField'
import { useAuth, type AuthUser } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

interface LoginResponse {
  user?: AuthUser
  token?: string
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage({ onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | undefined>()

  function validate(): boolean {
    let ok = true
    const trimmed = email.trim()
    if (!trimmed) {
      setEmailError('Email is required')
      ok = false
    } else if (!EMAIL_RE.test(trimmed)) {
      setEmailError('Enter a valid email address')
      ok = false
    } else {
      setEmailError(undefined)
    }

    if (!password) {
      setPasswordError('Password is required')
      ok = false
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      ok = false
    } else {
      setPasswordError(undefined)
    }
    return ok
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(undefined)
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      if (res.status === 401) {
        setFormError('Incorrect email or password')
        return
      }
      if (!res.ok) {
        setFormError(`Login failed (${res.status}). Please try again.`)
        return
      }

      const data: LoginResponse = await res.json().catch(() => ({}))
      const nextUser: AuthUser = data.user ?? {
        name: email.split('@')[0] || 'User',
        email: email.trim(),
      }
      signIn(nextUser)
      onSignedIn?.()
    } catch {
      setFormError('Network error. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-clarity-bg font-grotesk">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span
          aria-label="RORR"
          className="text-[20px] font-bold tracking-[0.08em] text-trust"
        >
          RORR
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-clarity text-clarity-muted transition-colors hover:bg-clarity-border/40 hover:text-clarity-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-trust"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 4l12 12M16 4L4 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-8 sm:px-6">
        <section className="w-full max-w-[420px] rounded-clarity bg-clarity-surface px-6 py-10 shadow-clarity sm:px-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-clarity bg-trust-tint text-trust">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 11a3 3 0 100-6 3 3 0 000 6z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M4 20a8 8 0 0116 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-[24px] font-bold leading-tight text-clarity-ink">
              Welcome back
            </h1>
            <p className="mt-2 text-[14px] font-normal text-clarity-muted">
              Sign in to continue to RORR
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <OutlinedTextField
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError(undefined)
                if (formError) setFormError(undefined)
              }}
              errorText={emailError}
              disabled={submitting}
            />

            <OutlinedTextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (passwordError) setPasswordError(undefined)
                if (formError) setFormError(undefined)
              }}
              errorText={passwordError}
              disabled={submitting}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-clarity text-clarity-muted hover:bg-clarity-border/40 hover:text-clarity-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-trust"
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 3l18 18M10.6 6.1A10 10 0 0112 6c5 0 9 4 10 6-.4.9-1.2 2.2-2.4 3.4M6.3 7.6C4.4 9 3.3 10.9 2 12c1 2 5 6 10 6 1.7 0 3.3-.5 4.7-1.3M9.9 9.9a3 3 0 004.2 4.2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  )}
                </button>
              }
            />

            <div className="flex items-center justify-end">
              <a
                href="#/forgot"
                className="text-[13px] font-medium text-trust hover:underline focus:outline-none focus-visible:underline"
              >
                Forgot password?
              </a>
            </div>

            {formError && (
              <div
                role="alert"
                className="rounded-clarity border border-clarity-danger/30 bg-clarity-danger/5 px-3 py-2 text-[13px] font-medium text-clarity-danger"
              >
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-clarity bg-trust px-4 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(0,82,204,0.25)] transition-colors hover:bg-trust-hover active:bg-trust-active focus:outline-none focus-visible:ring-2 focus-visible:ring-trust focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
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
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-clarity-muted">
            Don&apos;t have an account?{' '}
            <a
              href="#/signup"
              className="font-semibold text-trust hover:underline focus:outline-none focus-visible:underline"
            >
              Sign up
            </a>
          </p>
        </section>
      </main>

      <footer className="px-6 pb-6 text-center text-[12px] text-clarity-muted sm:px-10">
        ⓒPitch Interactive Co.,LTD. All rights reserved
      </footer>
    </div>
  )
}
