import { Button } from '../../components/Button'
import { RorrLogo } from '../../components/Logos'
import {
  useUserDetail,
  type UserDetail,
  type UserDetailError,
} from '../../hooks/useUserDetail'

interface UserDetailPageProps {
  userId: string
  onClose?: () => void
  onLogin?: () => void
}

function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return initials || 'U'
}

function formatJoinedDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function Avatar({ user }: { user: UserDetail }) {
  if (user.profileImage) {
    return (
      <img
        src={user.profileImage}
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
      {getInitials(user.name)}
    </div>
  )
}

function LoadingView() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="mt-10 flex flex-1 flex-col items-center"
    >
      <div className="h-24 w-24 animate-pulse rounded-full bg-brand-ink/10" />
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="h-5 w-32 animate-pulse rounded bg-brand-ink/10" />
        <div className="h-4 w-44 animate-pulse rounded bg-brand-ink/10" />
        <div className="mt-2 h-4 w-28 animate-pulse rounded bg-brand-ink/10" />
      </div>
      <span className="sr-only">사용자 정보를 불러오는 중입니다.</span>
    </div>
  )
}

function ErrorView({
  error,
  onLogin,
}: {
  error: UserDetailError
  onLogin?: () => void
}) {
  return (
    <div
      role="alert"
      className="mt-10 flex flex-1 flex-col items-center justify-center text-center"
    >
      <p className="text-[18px] font-semibold text-brand-ink">
        {error.kind === 'not-found'
          ? '사용자를 찾을 수 없습니다'
          : error.kind === 'unauthorized'
            ? '로그인이 필요합니다'
            : '문제가 발생했습니다'}
      </p>
      <p className="mt-2 text-[14px] font-light text-brand-ink/70">
        {error.message}
      </p>
      {error.kind === 'unauthorized' && onLogin && (
        <div className="mt-8 w-full max-w-xs">
          <Button
            variant="secondary"
            size="lg"
            className="w-full !rounded-[30px] !border-[#747775] !bg-white !text-brand-ink"
            onClick={onLogin}
          >
            Log in
          </Button>
        </div>
      )}
    </div>
  )
}

function SuccessView({ user }: { user: UserDetail }) {
  return (
    <div className="mt-10 flex flex-1 flex-col items-center">
      <Avatar user={user} />
      <div className="mt-6 flex flex-col items-center gap-1 text-center">
        <p className="text-[18px] font-semibold text-brand-ink">{user.name}</p>
        <p className="text-[14px] font-light text-brand-ink/70">{user.email}</p>
        <p className="mt-2 text-[13px] font-light text-brand-ink/60">
          <span className="text-brand-ink/50">가입일</span>{' '}
          <time dateTime={user.createdAt}>
            {formatJoinedDate(user.createdAt)}
          </time>
        </p>
      </div>
    </div>
  )
}

export function UserDetailPage({
  userId,
  onClose,
  onLogin,
}: UserDetailPageProps) {
  const { status, data, error } = useUserDetail(userId)

  return (
    <div className="flex min-h-full flex-col bg-brand-bg">
      <header className="flex items-center justify-between px-6 py-5 opacity-[0.66] sm:px-10">
        <RorrLogo className="text-xl" />
        {onClose && (
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
        )}
      </header>

      <main className="flex flex-1 px-4 pb-4 sm:px-6 sm:pb-6">
        <section className="flex w-full flex-col rounded-2xl bg-brand-card px-6 py-10 sm:px-10">
          <h1 className="text-center text-[24px] font-semibold leading-tight text-brand-ink">
            User
          </h1>

          {status === 'loading' && <LoadingView />}
          {status === 'error' && error && (
            <ErrorView error={error} onLogin={onLogin} />
          )}
          {status === 'success' && data && <SuccessView user={data} />}
        </section>
      </main>
    </div>
  )
}
