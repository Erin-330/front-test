import { Button } from '../../components/Button'
import { RorrLogo } from '../../components/Logos'
import type { AuthUser } from '../../hooks/useAuth'

interface ProfilePageProps {
  user: AuthUser
  onSignOut: () => void
  onClose?: () => void
}

function Avatar({ user }: { user: AuthUser }) {
  const initials = user.name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (user.picture) {
    return (
      <img
        src={user.picture}
        alt={`${user.name} 프로필 이미지`}
        className="h-24 w-24 rounded-full object-cover ring-1 ring-brand-ink/10"
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${user.name} 기본 프로필 이미지`}
      className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-bg text-2xl font-semibold text-white"
    >
      {initials || 'U'}
    </div>
  )
}

export function ProfilePage({ user, onSignOut, onClose }: ProfilePageProps) {
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
            Profile
          </h1>

          <div className="mt-10 flex flex-1 flex-col items-center">
            <Avatar user={user} />

            <div className="mt-6 flex flex-col items-center gap-1 text-center">
              <p className="text-[18px] font-semibold text-brand-ink">
                {user.name}
              </p>
              <p className="text-[14px] font-light text-brand-ink/70">
                {user.email}
              </p>
            </div>

            <div className="mt-10 w-full max-w-xs">
              <Button
                variant="secondary"
                size="lg"
                className="w-full !rounded-[30px] !border-[#747775] !bg-white !text-brand-ink"
                onClick={onSignOut}
              >
                Sign out
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
