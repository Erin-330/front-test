import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface LoginPageProps {
  onClose?: () => void
  onSignedIn?: () => void
}

const MOCK_USER_NAME = 'Erin Kim'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function LockPersonIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 7c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72V19h-2v-2.28c-.6-.34-1-.98-1-1.72 0-1.1.9-2 2-2z" />
    </svg>
  )
}

function MoreVertIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.92 2.92A11.8 11.8 0 0 0 23 12c-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.36 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16a3 3 0 0 0-3-3l-.17.01z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
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
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="#000"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M14.94 10.62c-.02-2.13 1.74-3.15 1.82-3.2-.99-1.45-2.54-1.65-3.09-1.67-1.31-.13-2.56.77-3.23.77-.67 0-1.7-.75-2.8-.73-1.44.02-2.77.84-3.51 2.13-1.5 2.6-.38 6.44 1.07 8.55.71 1.03 1.55 2.19 2.66 2.15 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.66.69 2.79.67 1.15-.02 1.88-1.05 2.59-2.09.81-1.2 1.15-2.37 1.17-2.43-.03-.01-2.24-.86-2.26-3.41zM12.83 4.39c.59-.72 1-1.71.89-2.7-.86.04-1.9.57-2.51 1.29-.55.63-1.03 1.65-.9 2.62.95.07 1.93-.49 2.52-1.21z" />
    </svg>
  )
}

export function LoginPage({ onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Please enter your email.')
      return
    }
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setSubmitting(true)
    try {
      signIn({
        name: MOCK_USER_NAME,
        email: email.trim(),
        picture: undefined,
      })
      onSignedIn?.()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Sign in failed. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn({ name: MOCK_USER_NAME, email: 'erin@rorr.club', picture: undefined })
    onSignedIn?.()
  }

  const handleAppleSignIn = () => {
    signIn({ name: MOCK_USER_NAME, email: 'erin@rorr.club', picture: undefined })
    onSignedIn?.()
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Security"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3]"
        >
          <LockPersonIcon />
        </button>
        <button
          type="button"
          aria-label="More options"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3]"
        >
          <MoreVertIcon />
        </button>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-10 pt-6 sm:pt-10">
        <section className="w-full max-w-[400px]">
          <h1
            className="mb-10 text-center text-[32px] font-bold tracking-tight text-[#2196F3]"
            aria-label="Reliant"
          >
            Reliant
          </h1>

          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-[13px] font-medium text-[#5f6368]"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-md border border-[#dadce0] bg-white px-4 text-[15px] text-[#202124] placeholder-[#9aa0a6] outline-none transition-colors focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-[13px] font-medium text-[#5f6368]"
                >
                  Password
                </label>
                <a
                  href="#/forgot-password"
                  className="text-[13px] font-medium text-[#2196F3] hover:underline focus:outline-none focus-visible:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-md border border-[#dadce0] bg-white px-4 pr-12 text-[15px] text-[#202124] placeholder-[#9aa0a6] outline-none transition-colors focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-2 my-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3]"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="text-[13px] font-medium text-[#d93025]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-md bg-[#2196F3] px-6 text-[15px] font-semibold uppercase tracking-[0.05em] text-white shadow-sm transition-colors hover:bg-[#1e88e5] active:bg-[#1976d2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#dadce0]" />
            <span className="text-[12px] font-medium uppercase tracking-wider text-[#9aa0a6]">
              or
            </span>
            <span className="h-px flex-1 bg-[#dadce0]" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-md border border-[#dadce0] bg-white px-4 text-[15px] font-medium text-[#3c4043] transition-colors hover:bg-[#f8f9fa] active:bg-[#f1f3f4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3] focus-visible:ring-offset-2"
            >
              <GoogleIcon />
              <span>Sign in with Google</span>
            </button>
            <button
              type="button"
              onClick={handleAppleSignIn}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-md border border-[#dadce0] bg-white px-4 text-[15px] font-medium text-[#3c4043] transition-colors hover:bg-[#f8f9fa] active:bg-[#f1f3f4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3] focus-visible:ring-offset-2"
            >
              <AppleIcon />
              <span>Sign in with Apple</span>
            </button>
          </div>

          <p className="mt-8 text-center text-[14px] text-[#5f6368]">
            Don't have an account?{' '}
            <a
              href="#/signup"
              className="font-semibold text-[#2196F3] hover:underline focus:outline-none focus-visible:underline"
            >
              Sign Up
            </a>
          </p>
        </section>
      </main>
    </div>
  )
}
