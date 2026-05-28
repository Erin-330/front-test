import { useState, type FormEvent } from 'react'
import { GoogleLoginButton } from '../../components/GoogleLoginButton'
import { PitchInteractiveLogo, RorrLogo } from '../../components/Logos'
import { useAuth, type AuthUser } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
  onSignUp?: () => void
}

interface FieldErrors {
  email?: string
  password?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MOCK_GOOGLE_USER: AuthUser = {
  name: 'Erin Kim',
  email: 'erin@rorr.club',
  picture: undefined,
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Please enter your email.'
  if (!EMAIL_PATTERN.test(value.trim())) return 'Please enter a valid email address.'
  return undefined
}

function validatePassword(value: string): string | undefined {
  if (!value) return 'Please enter your password.'
  if (value.length < 8) return 'Password must be at least 8 characters.'
  return undefined
}

export function LoginPage({ onClose, onSignedIn, onSignUp }: LoginPageProps) {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleGoogleSignIn = () => {
    signIn(MOCK_GOOGLE_USER)
    onSignedIn?.()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    const nextFieldErrors: FieldErrors = {
      email: emailError,
      password: passwordError,
    }
    setFieldErrors(nextFieldErrors)
    setFormError(null)

    if (emailError || passwordError) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      if (!response.ok) {
        let message = 'Login failed. Please check your credentials and try again.'
        try {
          const data = (await response.json()) as { message?: string; error?: string }
          if (data?.message) message = data.message
          else if (data?.error) message = data.error
        } catch {
          // ignore JSON parse errors and use default message
        }
        setFormError(message)
        return
      }

      const data = (await response.json()) as { user?: AuthUser }
      const user: AuthUser = data?.user ?? {
        name: email.trim().split('@')[0] ?? 'User',
        email: email.trim(),
      }
      signIn(user)
      onSignedIn?.()
    } catch {
      setFormError('Unable to connect. Please check your network and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-brand-bg">
      <header className="flex items-center justify-between px-6 py-5 opacity-[0.66] sm:px-10">
        <RorrLogo className="text-xl" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 inline-flex h-8 w-8 items-center justify-center text-white transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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

      <main className="flex flex-1 px-4 pb-4 sm:px-6 sm:pb-6">
        <section className="mx-auto flex w-full max-w-md flex-col rounded-2xl bg-brand-card px-6 py-10 sm:max-w-lg sm:px-10">
          <h1 className="text-center text-[24px] font-semibold leading-tight text-brand-ink">
            Log in / Sign up
          </h1>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 flex flex-col gap-4"
            aria-describedby={formError ? 'login-form-error' : undefined}
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-[13px] font-medium text-brand-ink"
              >
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={fieldErrors.email ? 'true' : 'false'}
                aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                className={[
                  'h-11 w-full rounded-md border bg-white px-3 text-[14px] text-brand-ink',
                  'placeholder:text-brand-ink/40',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                  fieldErrors.email
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : 'border-gray-300 focus-visible:ring-brand-ink/40',
                ].join(' ')}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p
                  id="login-email-error"
                  role="alert"
                  className="text-[12px] text-red-600"
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="text-[13px] font-medium text-brand-ink"
              >
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={fieldErrors.password ? 'true' : 'false'}
                aria-describedby={
                  fieldErrors.password ? 'login-password-error' : undefined
                }
                className={[
                  'h-11 w-full rounded-md border bg-white px-3 text-[14px] text-brand-ink',
                  'placeholder:text-brand-ink/40',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                  fieldErrors.password
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : 'border-gray-300 focus-visible:ring-brand-ink/40',
                ].join(' ')}
                placeholder="At least 8 characters"
              />
              {fieldErrors.password && (
                <p
                  id="login-password-error"
                  role="alert"
                  className="text-[12px] text-red-600"
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {formError && (
              <div
                id="login-form-error"
                role="alert"
                className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-700"
              >
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className={[
                'mt-2 inline-flex h-11 w-full items-center justify-center rounded-md',
                'bg-brand-ink text-[14px] font-semibold text-white',
                'transition-colors hover:bg-brand-ink/90 active:bg-brand-ink/80',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-ink',
                'disabled:cursor-not-allowed disabled:opacity-60',
              ].join(' ')}
            >
              {submitting ? 'Logging in…' : 'Log in'}
            </button>

            <p className="text-center text-[13px] text-brand-ink/80">
              Don&rsquo;t have an account?{' '}
              <a
                href="#/signup"
                onClick={(e) => {
                  if (onSignUp) {
                    e.preventDefault()
                    onSignUp()
                  }
                }}
                className="font-semibold text-brand-ink underline-offset-2 hover:underline focus:outline-none focus-visible:underline"
              >
                Sign up
              </a>
            </p>
          </form>

          <div className="mt-8 flex items-center gap-3 text-[12px] text-brand-ink/60">
            <span className="h-px flex-1 bg-brand-ink/20" aria-hidden="true" />
            <span>or</span>
            <span className="h-px flex-1 bg-brand-ink/20" aria-hidden="true" />
          </div>

          <div className="mt-6 flex flex-col items-center">
            <GoogleLoginButton onClick={handleGoogleSignIn} />

            <div className="mt-6 flex items-center gap-3 text-[14px] font-light text-brand-ink/80">
              <a
                href="#/terms"
                className="hover:underline focus:outline-none focus-visible:underline"
              >
                Terms of Use
              </a>
              <span aria-hidden="true" className="text-brand-ink/40">
                |
              </span>
              <a
                href="#/privacy"
                className="hover:underline focus:outline-none focus-visible:underline"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          <footer className="mt-8 flex flex-col items-center gap-3">
            <PitchInteractiveLogo />
            <p className="text-[12px] font-normal text-brand-ink/60">
              ⓒPitch Interactive Co.,LTD. All rights reserved
            </p>
          </footer>
        </section>
      </main>
    </div>
  )
}
