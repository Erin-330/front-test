import { useEffect, useState } from 'react'
import { RorrLogo } from '../../components/Logos'

interface UserDetail {
  id: number
  name: string
  email: string
  profileImage: string | null
  createdAt: string
}

interface UserDetailPageProps {
  userId: string
  onClose?: () => void
}

type LoadState =
  | { status: 'loading' }
  | { status: 'success'; user: UserDetail }
  | { status: 'error'; message: string }

function formatJoinDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function getInitials(name: string): string {
  return (
    name
      .split(' ')
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U'
  )
}

function Avatar({ user }: { user: UserDetail }) {
  if (user.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={`${user.name} 프로필 이미지`}
        className="h-28 w-28 rounded-full object-cover ring-1 ring-brand-ink/10"
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${user.name} 기본 프로필 이미지`}
      className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-bg text-3xl font-semibold text-white"
    >
      {getInitials(user.name)}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="mt-10 flex flex-1 flex-col items-center" aria-busy="true">
      <div className="h-28 w-28 animate-pulse rounded-full bg-brand-ink/10" />
      <div className="mt-6 h-5 w-40 animate-pulse rounded bg-brand-ink/10" />
      <div className="mt-3 h-4 w-56 animate-pulse rounded bg-brand-ink/10" />
      <div className="mt-3 h-4 w-32 animate-pulse rounded bg-brand-ink/10" />
      <p className="sr-only">유저 정보를 불러오는 중입니다.</p>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mt-10 flex flex-1 flex-col items-center text-center" role="alert">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 8v5M12 16.5h.01M4.93 19h14.14a2 2 0 0 0 1.74-3l-7.07-12a2 2 0 0 0-3.48 0L3.2 16a2 2 0 0 0 1.73 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="mt-4 text-[16px] font-semibold text-brand-ink">
        유저 정보를 불러오지 못했어요
      </p>
      <p className="mt-1 text-[13px] font-light text-brand-ink/70">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 h-[40px] rounded-[20px] border border-[#969cda] bg-white px-6 text-[14px] font-semibold text-[#46383a] transition-colors hover:bg-[#f5f6ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda] focus-visible:ring-offset-2"
      >
        다시 시도
      </button>
    </div>
  )
}

function UserCard({ user }: { user: UserDetail }) {
  return (
    <div className="mt-10 flex flex-1 flex-col items-center">
      <Avatar user={user} />

      <div className="mt-6 flex flex-col items-center gap-1 text-center">
        <p className="text-[20px] font-semibold text-brand-ink">{user.name}</p>
        <p className="text-[14px] font-light text-brand-ink/70">{user.email}</p>
      </div>

      <dl className="mt-8 w-full max-w-xs rounded-xl bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[13px] font-light text-brand-ink/60">가입일</dt>
          <dd className="text-[14px] font-medium text-brand-ink">
            {formatJoinDate(user.createdAt)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export function UserDetailPage({ userId, onClose }: UserDetailPageProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    fetch(`/users/${encodeURIComponent(userId)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? '존재하지 않는 유저입니다.'
              : `요청에 실패했어요 (${res.status})`,
          )
        }
        return (await res.json()) as UserDetail
      })
      .then((user) => {
        if (cancelled) return
        setState({ status: 'success', user })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했어요.'
        setState({ status: 'error', message })
      })

    return () => {
      cancelled = true
    }
  }, [userId, reloadKey])

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

          {state.status === 'loading' && <LoadingState />}
          {state.status === 'error' && (
            <ErrorState
              message={state.message}
              onRetry={() => setReloadKey((k) => k + 1)}
            />
          )}
          {state.status === 'success' && <UserCard user={state.user} />}
        </section>
      </main>
    </div>
  )
}
