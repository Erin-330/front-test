import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type SVGProps,
} from 'react'
import { GoogleLoginButton } from '../../components/GoogleLoginButton'
import { AppleLoginButton } from '../../components/AppleLoginButton'
import { useAuth } from '../../hooks/useAuth'
import { login, LoginApiError, type LoginSuccessData } from '../../services/auth'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const MAX_FAILED_ATTEMPTS = 5

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

export function LoginPage({ onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()
  const emailId = useId()
  const passwordId = useId()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [failures, setFailures] = useState(0)
  const [locked, setLocked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(id)
  }, [toast])

  const canSubmit =
    email.trim().length > 0 && password.length > 0 && !submitting && !locked

  function validate(): boolean {
    let nextEmailError: string | null = null
    let nextPasswordError: string | null = null

    if (!email.trim()) {
      nextEmailError = '이메일을 입력해주세요.'
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextEmailError = '올바른 이메일 형식이 아닙니다.'
    }

    if (!password) {
      nextPasswordError = '비밀번호를 입력해주세요.'
    } else if (password.length < 8) {
      nextPasswordError = '비밀번호는 8자 이상이어야 합니다.'
    }

    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    return !nextEmailError && !nextPasswordError
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting || locked) return
    setFormError(null)

    if (!validate()) {
      if (!EMAIL_REGEX.test(email.trim())) {
        emailRef.current?.focus()
      } else {
        passwordRef.current?.focus()
      }
      return
    }

    setSubmitting(true)
    try {
      const data: LoginSuccessData = await login({
        email: email.trim(),
        password,
      })
      signIn({
        name: data.user.name,
        email: data.user.email,
        picture: data.user.profile_image,
      })
      onSignedIn?.()
    } catch (err) {
      if (err instanceof LoginApiError) {
        const nextFailures = failures + 1
        setFailures(nextFailures)
        if (nextFailures >= MAX_FAILED_ATTEMPTS) {
          setLocked(true)
          setFormError(
            '5회 이상 로그인에 실패하였습니다. 보안을 위해 계정이 잠겼습니다. 잠시 후 다시 시도해주세요.',
          )
        } else {
          setFormError('이메일 또는 비밀번호를 확인해주세요.')
        }
      } else {
        setToast('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleGoogleSignIn() {
    signIn({
      name: 'Reliant 사용자',
      email: 'erin@rorr.club',
    })
    onSignedIn?.()
  }

  function handleAppleSignIn() {
    signIn({
      name: 'Reliant 사용자',
      email: 'apple-user@rorr.club',
    })
    onSignedIn?.()
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="flex items-center justify-between bg-brand-bg px-3 py-2 text-white sm:px-4">
        <button
          type="button"
          aria-label="보안 정보"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <LockPersonIcon className="h-6 w-6" />
        </button>

        <h1 className="text-[20px] font-semibold tracking-[0.04em] text-white">
          Reliant
        </h1>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="추가 메뉴"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <MoreVertIcon className="h-6 w-6" />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-12 z-10 w-44 overflow-hidden rounded-lg bg-white py-1 text-sm text-brand-ink shadow-lg ring-1 ring-black/5"
            >
              <a
                role="menuitem"
                href="#/help"
                className="block px-4 py-2 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                도움말
              </a>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                onClick={() => {
                  setMenuOpen(false)
                  onClose?.()
                }}
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col px-6 pb-10 pt-8 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <h2 className="text-center text-2xl font-bold text-brand-ink">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            계정에 로그인하여 Reliant를 시작하세요.
          </p>

          {formError && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              <WarningIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor={emailId}
                className="mb-1 block text-sm font-medium text-brand-ink"
              >
                이메일 주소
              </label>
              <input
                ref={emailRef}
                id={emailId}
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError(null)
                  if (formError) setFormError(null)
                }}
                disabled={locked}
                aria-invalid={emailError ? 'true' : 'false'}
                aria-describedby={
                  emailError ? `${emailId}-error` : undefined
                }
                className={[
                  'block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-brand-ink shadow-sm',
                  'placeholder:text-gray-400',
                  'focus:outline-none focus:ring-2',
                  'disabled:cursor-not-allowed disabled:bg-gray-50',
                  emailError
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-brand-bg focus:ring-brand-bg/30',
                ].join(' ')}
              />
              {emailError && (
                <p
                  id={`${emailId}-error`}
                  className="mt-1 text-xs text-red-600"
                >
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor={passwordId}
                  className="block text-sm font-medium text-brand-ink"
                >
                  비밀번호
                </label>
                <a
                  href="#/forgot-password"
                  className="text-xs font-medium text-brand-bg hover:underline focus:outline-none focus-visible:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  ref={passwordRef}
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) setPasswordError(null)
                    if (formError) setFormError(null)
                  }}
                  disabled={locked}
                  aria-invalid={passwordError ? 'true' : 'false'}
                  aria-describedby={
                    passwordError ? `${passwordId}-error` : undefined
                  }
                  className={[
                    'block w-full rounded-md border bg-white px-3 py-2.5 pr-10 text-sm text-brand-ink shadow-sm',
                    'placeholder:text-gray-400',
                    'focus:outline-none focus:ring-2',
                    'disabled:cursor-not-allowed disabled:bg-gray-50',
                    passwordError
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-brand-bg focus:ring-brand-bg/30',
                  ].join(' ')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                  }
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-gray-500 hover:text-brand-ink focus:outline-none focus-visible:text-brand-ink"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p
                  id={`${passwordId}-error`}
                  className="mt-1 text-xs text-red-600"
                >
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              aria-busy={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-bg px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-bg/90 active:bg-brand-bg/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bg/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Spinner className="h-4 w-4" />}
              <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="space-y-3">
            <GoogleLoginButton
              onClick={handleGoogleSignIn}
              className="w-full"
              disabled={submitting || locked}
            />
            <AppleLoginButton
              onClick={handleAppleSignIn}
              disabled={submitting || locked}
            />
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a
              href="#/signup"
              className="font-semibold text-brand-bg hover:underline focus:outline-none focus-visible:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </main>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 top-20 z-20 flex justify-center px-4"
        >
          <div className="pointer-events-auto rounded-md bg-brand-ink/90 px-4 py-2 text-sm text-white shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

function LockPersonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M10 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 9c1.6 0 3.05.27 4.25.74-.46.6-.75 1.34-.75 2.16V20H3v-1.5c0-2.7 4.67-4 7-4Zm7-1.5a2.5 2.5 0 0 1 2.5 2.5V15h.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h.5v-1a2.5 2.5 0 0 1 2.5-2.5Zm0 1.5a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Z" />
    </svg>
  )
}

function MoreVertIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  )
}

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" />
      <path d="M9.88 4.24A10.6 10.6 0 0 1 12 4c6.5 0 10 7 10 7a16.7 16.7 0 0 1-3.16 4.06" />
      <path d="M6.61 6.61A16.93 16.93 0 0 0 2 12s3.5 7 10 7c1.46 0 2.83-.27 4.1-.74" />
    </svg>
  )
}

function WarningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2 1 21h22L12 2Zm0 6 7.5 12.5h-15L12 8Zm-1 4v4h2v-4h-2Zm0 6v2h2v-2h-2Z" />
    </svg>
  )
}

function Spinner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
      className={['animate-spin', props.className].filter(Boolean).join(' ')}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="4"
      />
      <path
        d="M4 12a8 8 0 0 1 8-8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}
