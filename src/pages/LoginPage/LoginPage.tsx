import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? ''
const PRIMARY = '#2196F3'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function LoginPage({ onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return

    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요')
      return
    }
    if (password.length === 0) {
      setError('비밀번호를 입력해주세요')
      return
    }

    setError(null)
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 401) {
        setError('이메일 또는 비밀번호를 확인해주세요')
        return
      }
      if (!response.ok) {
        setError('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요')
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
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#F5F7FA]">
      <header
        className="flex items-center justify-between bg-white px-4 py-3"
        style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}
      >
        <button
          type="button"
          aria-label="Security"
          className="inline-flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
        >
          <span className="material-icons text-[24px]">lock_person</span>
        </button>
        <h1
          className="text-[22px] font-bold tracking-tight"
          style={{ color: PRIMARY }}
        >
          Reliant
        </h1>
        <button
          type="button"
          aria-label="More options"
          className="inline-flex h-10 w-10 items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
        >
          <span className="material-icons text-[24px]">more_vert</span>
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <section
          className="w-full max-w-[400px] rounded-lg bg-white"
          style={{
            boxShadow:
              '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)',
            padding: '40px',
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <OutlinedInput
              id="email"
              type="email"
              label="Email Address"
              placeholder="name@company.com"
              value={email}
              onChange={(v) => {
                setEmail(v)
                if (error) setError(null)
              }}
              autoComplete="email"
            />

            <div className="mt-6">
              <div className="mb-1 flex items-center justify-end">
                <a
                  href="#/forgot"
                  className="text-[13px] font-medium hover:underline focus:outline-none focus-visible:underline"
                  style={{ color: PRIMARY }}
                >
                  Forgot Password?
                </a>
              </div>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(v) => {
                  setPassword(v)
                  if (error) setError(null)
                }}
                autoComplete="current-password"
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="inline-flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    <span className="material-icons text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                }
              />
            </div>

            {error ? (
              <p className="mt-3 text-[13px] text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded text-[15px] font-bold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed"
              style={{
                backgroundColor: loading ? '#64B5F6' : PRIMARY,
                height: '48px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              }}
            >
              {loading ? (
                <span
                  className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-label="Loading"
                />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-300" />
            <span className="text-[13px] text-gray-500">or</span>
            <span className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded border border-gray-300 bg-white text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            >
              <GoogleIcon />
              Sign in with Google
            </button>
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded bg-black text-[14px] font-medium text-white transition-colors hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <AppleIcon />
              Sign in with Apple
            </button>
          </div>

          <p className="mt-6 text-center text-[13px] text-gray-600">
            Don't have an account?{' '}
            <a
              href="#/signup"
              className="font-medium hover:underline focus:outline-none focus-visible:underline"
              style={{ color: PRIMARY }}
            >
              Sign Up
            </a>
          </p>
        </section>
      </main>
    </div>
  )
}

interface OutlinedInputProps {
  id: string
  type: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  trailing?: React.ReactNode
}

function OutlinedInput({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
  trailing,
}: OutlinedInputProps) {
  const [focused, setFocused] = useState(false)
  const floating = focused || value.length > 0
  const borderColor = focused ? PRIMARY : '#BDBDBD'

  return (
    <div className="relative">
      <fieldset
        className="absolute inset-0 rounded pointer-events-none transition-colors"
        style={{
          border: `${focused ? 2 : 1}px solid ${borderColor}`,
          top: '-6px',
        }}
      >
        <legend
          className="ml-2 px-1 transition-all"
          style={{
            fontSize: floating ? '12px' : '0px',
            color: focused ? PRIMARY : '#757575',
            lineHeight: '1',
            height: floating ? 'auto' : '0px',
            visibility: floating ? 'visible' : 'hidden',
          }}
        >
          {label}
        </legend>
      </fieldset>
      {!floating ? (
        <label
          htmlFor={id}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none"
          style={{ color: '#757575' }}
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={floating ? placeholder : ''}
        autoComplete={autoComplete}
        className="relative w-full bg-transparent text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none"
        style={{
          height: '56px',
          paddingLeft: '12px',
          paddingRight: trailing ? '44px' : '12px',
        }}
      />
      {trailing ? (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {trailing}
        </div>
      ) : null}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 384 512"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  )
}
