import { useState, type FormEvent } from 'react'
import { AppleLoginButton } from '../../components/AppleLoginButton'
import { GoogleLoginButton } from '../../components/GoogleLoginButton'
import { PitchInteractiveLogo, RorrLogo } from '../../components/Logos'
import { useAuth, type AuthUser } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    name: string
    createdAt: string
  }
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

const API_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: Record<string, string> }).env
      ?.VITE_API_URL) ||
  ''

function validateEmail(value: string): string | null {
  if (!value) return '이메일을 입력해주세요.'
  if (!EMAIL_REGEX.test(value)) return '올바른 이메일 형식이 아닙니다.'
  return null
}

function validatePassword(value: string): string | null {
  if (!value) return '비밀번호를 입력해주세요.'
  if (value.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.'
  if (!PASSWORD_REGEX.test(value))
    return '비밀번호는 영문과 숫자를 조합해야 합니다.'
  return null
}

export function LoginPage({ onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return

    const nextEmailError = validateEmail(email)
    const nextPasswordError = validatePassword(password)
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    setFormError(null)

    if (nextEmailError || nextPasswordError) return

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 401) {
        setFormError('이메일 또는 비밀번호를 확인해주세요')
        return
      }

      if (!response.ok) {
        setFormError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.')
        return
      }

      const data = (await response.json()) as LoginResponse
      const nextUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        createdAt: data.user.createdAt,
      }
      signIn(nextUser, data.accessToken)
      onSignedIn?.()
    } catch {
      setFormError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialPlaceholder = (provider: 'google' | 'apple') => () => {
    setFormError(
      provider === 'google'
        ? 'Google 로그인은 곧 제공될 예정입니다.'
        : 'Apple 로그인은 곧 제공될 예정입니다.',
    )
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
            noValidate
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex w-full max-w-[320px] flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="login-email"
                className="text-[13px] font-medium text-brand-ink/80"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                disabled={loading}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError(null)
                  if (formError) setFormError(null)
                }}
                onBlur={() => setEmailError(validateEmail(email))}
                aria-invalid={emailError ? 'true' : 'false'}
                aria-describedby={emailError ? 'login-email-error' : undefined}
                placeholder="you@example.com"
                className={[
                  'h-11 w-full rounded-md border bg-white px-3 text-[14px] text-brand-ink',
                  'placeholder:text-brand-ink/40',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda]',
                  'disabled:cursor-not-allowed disabled:bg-gray-100',
                  emailError ? 'border-red-500' : 'border-gray-300',
                ].join(' ')}
              />
              {emailError && (
                <p
                  id="login-email-error"
                  role="alert"
                  className="text-[12px] text-red-600"
                >
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="login-password"
                className="text-[13px] font-medium text-brand-ink/80"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                disabled={loading}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) setPasswordError(null)
                  if (formError) setFormError(null)
                }}
                onBlur={() => setPasswordError(validatePassword(password))}
                aria-invalid={passwordError ? 'true' : 'false'}
                aria-describedby={
                  passwordError ? 'login-password-error' : undefined
                }
                placeholder="최소 8자, 영문+숫자"
                className={[
                  'h-11 w-full rounded-md border bg-white px-3 text-[14px] text-brand-ink',
                  'placeholder:text-brand-ink/40',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda]',
                  'disabled:cursor-not-allowed disabled:bg-gray-100',
                  passwordError ? 'border-red-500' : 'border-gray-300',
                ].join(' ')}
              />
              {passwordError && (
                <p
                  id="login-password-error"
                  role="alert"
                  className="text-[12px] text-red-600"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {formError && (
              <p
                role="alert"
                className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-700"
              >
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="mt-2 inline-flex h-[48px] items-center justify-center gap-2 rounded-[30px] bg-[#969cda] text-[16px] font-semibold text-white shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#afb5ea] active:bg-[#7e85c9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
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
              <span>{loading ? '로그인 중…' : 'Log in'}</span>
            </button>

            <div className="flex items-center justify-between text-[13px] text-brand-ink/80">
              <a
                href="#/forgot-password"
                className="hover:underline focus:outline-none focus-visible:underline"
              >
                Forgot Password?
              </a>
              <span>
                Don&apos;t have an account?{' '}
                <a
                  href="#/sign-up"
                  className="font-semibold text-[#5b62c1] hover:underline focus:outline-none focus-visible:underline"
                >
                  Sign Up
                </a>
              </span>
            </div>
          </form>

          <div className="mx-auto mt-8 flex w-full max-w-[320px] items-center gap-3">
            <span className="h-px flex-1 bg-brand-ink/15" />
            <span className="text-[12px] uppercase tracking-wide text-brand-ink/50">
              or
            </span>
            <span className="h-px flex-1 bg-brand-ink/15" />
          </div>

          <div className="mx-auto mt-6 flex w-full max-w-[320px] flex-col items-stretch gap-3">
            <GoogleLoginButton onClick={handleSocialPlaceholder('google')} />
            <AppleLoginButton onClick={handleSocialPlaceholder('apple')} />
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 text-[14px] font-light text-brand-ink/80">
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
    </div>
  )
}
