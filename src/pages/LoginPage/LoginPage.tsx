import { GoogleLoginButton } from '../../components/GoogleLoginButton'
import { PitchInteractiveLogo, RorrLogo } from '../../components/Logos'
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

export function LoginPage({ onClose, onSignedIn }: LoginPageProps) {
  const { signIn } = useAuth()

  const handleGoogleSignIn = () => {
    signIn(MOCK_USER)
    onSignedIn?.()
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

          <div className="mt-12 flex flex-1 flex-col items-center justify-center">
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
