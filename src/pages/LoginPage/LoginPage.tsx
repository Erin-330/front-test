import { useState, type FormEvent } from 'react'
import { GoogleLoginButton } from '../../components/GoogleLoginButton'
import { PitchInteractiveLogo, RorrLogo } from '../../components/Logos'
import { useAuth } from '../../hooks/useAuth'
import { loginRequest, persistTokens } from '../../lib/api'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const MOCK_GOOGLE_USER = {
  name: 'Erin Kim',
  email: 'erin@rorr.club',
  picture: undefined,
}

function validateEmail(value: string): string | null {
  if (value.length === 0) return '이메일을 입력해주세요.'
  if (!EMAIL_REGEX.test(value)) return '잘못된 이메일 형식입니다.'
  return null
}

function validatePassword(value: string): string | null {
  if (value.length === 0) return '비밀번호를 입력해주세요.'
  if (value.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.'
  return null
}

export function LoginPage({ onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleGoogleSignIn = () => {
    signIn(MOCK_GOOGLE_USER)
    onSignedIn?.()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setToast(null)

    const emailMsg = validateEmail(email)
    const passwordMsg = validatePassword(password)
    setEmailError(emailMsg)
    setPasswordError(passwordMsg)
    if (emailMsg || passwordMsg) return

    setSubmitting(true)
    try {
      const result = await loginRequest(email, password)
      if (result.status === 'success') {
        persistTokens({
          access_token: result.data.access_token,
          refresh_token: result.data.refresh_token,
        })
        signIn({
          name: result.data.user.name,
          email: result.data.user.email,
          picture: result.data.user.profile_image,
        })
        onSignedIn?.()
      } else {
        setFormError(result.message)
      }
    } catch {
      setToast('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
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
        <section className="flex w-full flex-col rounded-2xl bg-brand-card px-6 py-10 sm:px-10">
          <h1 className="text-center text-[24px] font-semibold leading-tight text-brand-ink">
            Log in / Sign up
          </h1>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-4"
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
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError(validateEmail(e.target.value))
                }}
                onBlur={() => setEmailError(validateEmail(email))}
                aria-invalid={emailError ? 'true' : 'false'}
                aria-describedby={emailError ? 'login-email-error' : undefined}
                className={[
                  'h-11 rounded-md border bg-white px-3 text-[14px] text-brand-ink',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                  emailError ? 'border-red-500' : 'border-gray-300',
                ].join(' ')}
              />
              {emailError && (
                <p id="login-email-error" className="text-[12px] text-red-600">
                  {emailError}
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
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) setPasswordError(validatePassword(e.target.value))
                  }}
                  onBlur={() => setPasswordError(validatePassword(password))}
                  aria-invalid={passwordError ? 'true' : 'false'}
                  aria-describedby={passwordError ? 'login-password-error' : undefined}
                  className={[
                    'h-11 w-full rounded-md border bg-white pl-3 pr-10 text-[14px] text-brand-ink',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    passwordError ? 'border-red-500' : 'border-gray-300',
                  ].join(' ')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path
                        d="M10.58 10.58a2 2 0 002.83 2.83M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1.04 2.34-2.83 4.27-5.06 5.51M6.06 6.06C4.21 7.36 2.77 9.12 2 11c1.04 2.34 2.83 4.27 5.06 5.51A10.94 10.94 0 0012 17c1.06 0 2.09-.14 3.06-.4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p id="login-password-error" className="text-[12px] text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <a
                href="#/forgot-password"
                className="text-[12px] font-medium text-brand-ink/70 hover:text-brand-ink hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {formError && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700"
              >
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {submitting && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              )}
              {submitting ? '로그인 중...' : 'Sign In'}
            </button>

            <p className="text-center text-[13px] text-brand-ink/70">
              Don't have an account?{' '}
              <a
                href="#/signup"
                className="font-semibold text-blue-600 hover:underline focus:outline-none focus-visible:underline"
              >
                Sign Up
              </a>
            </p>

            <div className="my-2 flex items-center gap-3 text-[11px] uppercase tracking-wider text-brand-ink/50">
              <span className="h-px flex-1 bg-brand-ink/15" />
              or
              <span className="h-px flex-1 bg-brand-ink/15" />
            </div>

            <div className="flex justify-center">
              <GoogleLoginButton onClick={handleGoogleSignIn} />
            </div>
          </form>

          <div className="mt-8 flex items-center justify-center gap-3 text-[14px] font-light text-brand-ink/80">
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

          <footer className="mt-8 flex flex-col items-center gap-3">
            <PitchInteractiveLogo />
            <p className="text-[12px] font-normal text-brand-ink/60">
              ⓒPitch Interactive Co.,LTD. All rights reserved
            </p>
          </footer>
        </section>
      </main>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-black/85 px-4 py-2 text-[13px] text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
