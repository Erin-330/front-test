import { useEffect, useMemo, useState } from 'react'
import { AppleLoginButton } from '../../components/AppleLoginButton'
import { GoogleLoginButton } from '../../components/GoogleLoginButton'
import { PitchInteractiveLogo } from '../../components/Logos'
import { TopAppBar } from '../../components/TopAppBar'
import { useAuth } from '../../hooks/useAuth'
import {
  AUTH_TOKEN_KEY,
  LoginApiError,
  getFailedAttempts,
  login,
} from '../../lib/authApi'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
  onSignUp?: () => void
  onForgotPassword?: () => void
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const MIN_PASSWORD_LENGTH = 8

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 10s2.7-5 8-5 8 5 8 5-2.7 5-8 5-8-5-8-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 3l14 14M5 6.5C3.3 7.9 2 10 2 10s2.7 5 8 5c1.6 0 3-.4 4.2-1M8 5.2c.6-.1 1.3-.2 2-.2 5.3 0 8 5 8 5s-1 1.8-2.7 3.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.5 8.5a2.5 2.5 0 0 0 3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LoginPage({
  onClose,
  onSignedIn,
  onSignUp,
  onForgotPassword,
}: LoginPageProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(id)
  }, [toast])

  const emailError = useMemo(() => {
    if (!email) return touched.email ? '이메일을 입력해주세요.' : null
    if (!EMAIL_REGEX.test(email)) return '올바른 이메일 형식이 아닙니다.'
    return null
  }, [email, touched.email])

  const passwordError = useMemo(() => {
    if (!password) return touched.password ? '비밀번호를 입력해주세요.' : null
    if (password.length < MIN_PASSWORD_LENGTH)
      return `비밀번호는 최소 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`
    return null
  }, [password, touched.password])

  const canSubmit =
    !submitting &&
    email.length > 0 &&
    password.length >= MIN_PASSWORD_LENGTH &&
    EMAIL_REGEX.test(email)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ email: true, password: true })
    setFormError(null)

    if (!EMAIL_REGEX.test(email)) {
      setFormError('올바른 이메일 형식이 아닙니다.')
      return
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(`비밀번호는 최소 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`)
      return
    }

    setSubmitting(true)
    try {
      const response = await login({ email, password })
      try {
        window.localStorage.setItem(
          AUTH_TOKEN_KEY,
          JSON.stringify({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in,
          }),
        )
      } catch {
        // localStorage may be unavailable; non-fatal.
      }
      signIn({
        name: response.data.user.name,
        email: response.data.user.email,
        picture: response.data.user.profile_image,
      })
      onSignedIn?.()
    } catch (err) {
      if (err instanceof LoginApiError) {
        if (err.code === 'AUTH_001') {
          const attempts = getFailedAttempts(email)
          const remaining = Math.max(0, 5 - attempts)
          setFormError(
            remaining > 0
              ? `이메일 또는 비밀번호를 확인해주세요. (남은 시도: ${remaining}회)`
              : '이메일 또는 비밀번호를 확인해주세요.',
          )
        } else if (err.code === 'AUTH_LOCKED') {
          setFormError(err.message)
        } else if (err.code === 'VALID_001') {
          setFormError(err.message)
        } else {
          setFormError(err.message)
        }
      } else {
        setToast('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn({
      name: 'Erin Kim',
      email: 'erin@rorr.club',
      picture: undefined,
    })
    onSignedIn?.()
  }

  const handleAppleSignIn = () => {
    signIn({
      name: 'Apple User',
      email: 'apple@rorr.club',
      picture: undefined,
    })
    onSignedIn?.()
  }

  return (
    <div className="flex min-h-full flex-col bg-brand-bg">
      <TopAppBar onClose={onClose} />

      <main className="flex flex-1 px-4 pb-4 sm:px-6 sm:pb-6">
        <section className="flex w-full flex-col rounded-2xl bg-brand-card px-6 py-8 sm:px-10">
          <h1 className="text-center text-[24px] font-semibold leading-tight text-brand-ink">
            Sign in to Reliant
          </h1>
          <p className="mt-2 text-center text-[13px] font-light text-brand-ink/70">
            Use your email and password to continue
          </p>

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
                Email Address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'login-email-error' : undefined}
                className={[
                  'h-11 w-full rounded-[10px] border bg-white px-3 text-[14px] text-brand-ink',
                  'placeholder:text-brand-ink/40',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda]',
                  emailError
                    ? 'border-red-500 focus-visible:ring-red-400'
                    : 'border-[#d3d5db]',
                ].join(' ')}
              />
              {emailError && (
                <p
                  id="login-email-error"
                  className="text-[12px] font-medium text-red-600"
                  role="alert"
                >
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-[13px] font-medium text-brand-ink"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onForgotPassword?.()}
                  className="text-[12px] font-medium text-[#46383a] underline-offset-2 hover:underline focus:outline-none focus-visible:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div
                className={[
                  'relative flex items-center rounded-[10px] border bg-white',
                  'focus-within:ring-2',
                  passwordError
                    ? 'border-red-500 focus-within:ring-red-400'
                    : 'border-[#d3d5db] focus-within:ring-[#969cda]',
                ].join(' ')}
              >
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={
                    passwordError ? 'login-password-error' : undefined
                  }
                  className="h-11 w-full bg-transparent px-3 pr-11 text-[14px] text-brand-ink placeholder:text-brand-ink/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-ink/60 hover:text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda]"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {passwordError && (
                <p
                  id="login-password-error"
                  className="text-[12px] font-medium text-red-600"
                  role="alert"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {formError && (
              <div
                id="login-form-error"
                role="alert"
                className="rounded-md bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700"
              >
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                'mt-2 inline-flex h-12 w-full items-center justify-center rounded-[30px] text-[16px] font-semibold text-white',
                'shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)] transition-colors',
                canSubmit
                  ? 'bg-[#969cda] hover:bg-[#afb5ea] active:bg-[#7e85c9]'
                  : 'bg-[#969cda]/50 cursor-not-allowed',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda] focus-visible:ring-offset-2',
              ].join(' ')}
            >
              {submitting ? (
                <>
                  <Spinner />
                  <span className="ml-2">Signing in…</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-[12px] text-brand-ink/60">
            <span className="h-px flex-1 bg-brand-ink/15" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-brand-ink/15" />
          </div>

          <div className="mt-4 flex flex-col items-stretch gap-2.5">
            <GoogleLoginButton onClick={handleGoogleSignIn} className="w-full" />
            <AppleLoginButton onClick={handleAppleSignIn} className="w-full" />
          </div>

          <p className="mt-6 text-center text-[13px] text-brand-ink/80">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => onSignUp?.()}
              className="font-semibold text-[#46383a] underline-offset-2 hover:underline focus:outline-none focus-visible:underline"
            >
              Sign Up
            </button>
          </p>

          <footer className="mt-8 flex flex-col items-center gap-2">
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
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-30 mx-auto flex w-fit items-center rounded-full bg-black/85 px-4 py-2 text-[13px] font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
