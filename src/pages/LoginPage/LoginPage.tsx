import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function GoogleIcon() {
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

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
      fill="#000000"
    >
      <path d="M17.05 12.04c-.02-2.05 1.68-3.04 1.76-3.09-.96-1.4-2.46-1.6-2.99-1.62-1.27-.13-2.49.75-3.14.75-.66 0-1.65-.73-2.72-.71-1.4.02-2.69.81-3.41 2.06-1.46 2.53-.37 6.27 1.04 8.32.69 1 1.51 2.13 2.58 2.09 1.04-.04 1.43-.67 2.68-.67 1.25 0 1.6.67 2.7.65 1.12-.02 1.83-1.02 2.51-2.03.79-1.16 1.12-2.29 1.14-2.35-.03-.01-2.18-.84-2.2-3.4ZM15.02 5.84c.57-.69.95-1.66.84-2.62-.82.03-1.81.55-2.4 1.24-.53.61-.99 1.59-.86 2.54.91.07 1.84-.47 2.42-1.16Z" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
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
  )
}

export function LoginPage({ onClose: _onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (value: string): string => {
    if (!value) return 'Email is required.'
    if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address.'
    return ''
  }

  const validatePassword = (value: string): string => {
    if (!value) return 'Password is required.'
    if (value.length < 8) return 'Password must be at least 8 characters.'
    return ''
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailError(eErr)
    setPasswordError(pErr)
    setSubmitError('')
    if (eErr || pErr) return

    setLoading(true)
    try {
      const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
      const apiUrl = env?.VITE_API_URL ?? ''
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.status === 200) {
        const data = await res.json().catch(() => ({}))
        if (data?.accessToken) {
          window.localStorage.setItem('accessToken', data.accessToken)
        }
        signIn({
          name: data?.user?.name ?? email.split('@')[0],
          email: data?.user?.email ?? email,
          picture: data?.user?.picture,
        })
        onSignedIn?.()
        return
      }

      if (res.status === 401) {
        setSubmitError('이메일 또는 비밀번호를 확인해주세요.')
      } else if (res.status === 400) {
        const data = await res.json().catch(() => ({}))
        setSubmitError(data?.message ?? '입력하신 정보를 다시 확인해주세요.')
      } else {
        setSubmitError('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    } catch {
      setSubmitError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const emailBorder = emailError
    ? 'border-[#ba1a1a] focus:border-[#ba1a1a]'
    : 'border-[#DFE1E6] focus:border-[#0052cc]'
  const passwordBorder = passwordError
    ? 'border-[#ba1a1a] focus:border-[#ba1a1a]'
    : 'border-[#DFE1E6] focus:border-[#0052cc]'

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-hanken">
      <header
        className="fixed inset-x-0 top-0 z-10 flex h-14 items-center justify-between border-b border-[#DFE1E6] bg-white px-4"
      >
        <span
          className="material-icons select-none text-[#172b4d]"
          style={{ fontSize: 24 }}
          aria-hidden="true"
        >
          lock_person
        </span>
        <h1
          className="text-[24px] font-bold leading-none text-[#0052cc]"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
          Reliant
        </h1>
        <button
          type="button"
          aria-label="More options"
          className="flex h-8 w-8 items-center justify-center text-[#172b4d] focus:outline-none"
        >
          <span
            className="material-icons select-none"
            style={{ fontSize: 24 }}
            aria-hidden="true"
          >
            more_vert
          </span>
        </button>
      </header>

      <main className="px-4 pt-20 pb-8">
        <section
          className="mx-auto w-full rounded-lg bg-white p-6"
          style={{
            maxWidth: 400,
            boxShadow: '0px 4px 12px rgba(0, 82, 204, 0.08)',
          }}
        >
          <h2 className="mb-6 text-[28px] font-bold leading-tight text-[#041b3c]">
            Sign In
          </h2>

          <form noValidate onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-[14px] font-semibold text-[#434654]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError('')
                  if (submitError) setSubmitError('')
                }}
                onBlur={() => setEmailError(validateEmail(email))}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                className={`w-full rounded-lg border px-3 py-3 text-[16px] text-[#041b3c] placeholder-[#737685] outline-none focus:border-2 ${emailBorder}`}
                style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
              />
              {emailError && (
                <p
                  id="email-error"
                  className="mt-1 text-[12px] text-[#ba1a1a]"
                  role="alert"
                >
                  {emailError}
                </p>
              )}
            </div>

            <div className="mb-2">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[14px] font-semibold text-[#434654]"
                >
                  Password
                </label>
                <a
                  href="#/forgot-password"
                  className="text-[14px] text-[#0052cc] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) setPasswordError('')
                    if (submitError) setSubmitError('')
                  }}
                  onBlur={() => setPasswordError(validatePassword(password))}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  className={`w-full rounded-lg border px-3 py-3 pr-11 text-[16px] text-[#041b3c] placeholder-[#737685] outline-none focus:border-2 ${passwordBorder}`}
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#737685] focus:outline-none"
                >
                  <span
                    className="material-icons select-none"
                    style={{ fontSize: 20 }}
                    aria-hidden="true"
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {passwordError && (
                <p
                  id="password-error"
                  className="mt-1 text-[12px] text-[#ba1a1a]"
                  role="alert"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {submitError && (
              <p
                className="mt-3 text-[13px] text-[#ba1a1a]"
                role="alert"
              >
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0052cc] px-3 py-3 text-[16px] font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                boxShadow: '0px 2px 8px rgba(0, 82, 204, 0.2)',
                fontFamily: "'Hanken Grotesk', sans-serif",
              }}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0 16px',
            }}
          >
            <div style={{ flex: 1, height: 1, background: '#DFE1E6' }} />
            <span
              style={{ padding: '0 12px', color: '#737685', fontSize: 12 }}
            >
              or
            </span>
            <div style={{ flex: 1, height: 1, background: '#DFE1E6' }} />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => console.log('Google OAuth')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#DFE1E6] bg-white p-[10px] text-[14px] font-semibold text-[#041b3c] hover:bg-[#f5f7fb]"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => console.log('Apple OAuth')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#DFE1E6] bg-white p-[10px] text-[14px] font-semibold text-[#041b3c] hover:bg-[#f5f7fb]"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              <AppleIcon />
              <span>Apple</span>
            </button>
          </div>

          <p className="mt-8 text-center text-[14px] text-[#434654]">
            Don't have an account?{' '}
            <a
              href="#/signup"
              className="font-semibold text-[#0052cc] hover:underline"
            >
              Sign Up
            </a>
          </p>
        </section>
      </main>
    </div>
  )
}
