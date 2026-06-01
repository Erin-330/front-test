import { useEffect, useState } from 'react'
import { RorrLogo } from '../../components/Logos'

interface UserDetail {
  id: string
  name: string
  email: string
  profileImage: string | null
  createdAt: string
}

interface UserDetailPageProps {
  userId: string
  onClose?: () => void
}

type FetchState =
  | { status: 'loading' }
  | { status: 'success'; user: UserDetail }
  | { status: 'error'; message: string }

function formatJoinedDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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

function Avatar({ name, src }: { name: string; src: string | null }) {
  if (src) {
    return (
      <img
        src={src}
        alt={`${name} 프로필 이미지`}
        className="h-24 w-24 rounded-full object-cover ring-1 ring-brand-ink/10"
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${name} 기본 프로필 이미지`}
      className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-bg text-2xl font-semibold text-white"
    >
      {getInitials(name)}
    </div>
  )
}

export function UserDetailPage({ userId, onClose }: UserDetailPageProps) {
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    fetch(`/users/${encodeURIComponent(userId)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`)
        }
        return (await res.json()) as UserDetail
      })
      .then((user) => {
        if (!cancelled) setState({ status: 'success', user })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message =
          err instanceof Error ? err.message : '유저 정보를 불러오지 못했습니다.'
        setState({ status: 'error', message })
      })

    return () => {
      cancelled = true
    }
  }, [userId])

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

          <div className="mt-10 flex flex-1 flex-col items-center">
            {state.status === 'loading' && (
              <p
                role="status"
                aria-live="polite"
                className="text-[14px] font-light text-brand-ink/70"
              >
                Loading…
              </p>
            )}

            {state.status === 'error' && (
              <p
                role="alert"
                className="text-[14px] font-light text-red-600"
              >
                {state.message}
              </p>
            )}

            {state.status === 'success' && (
              <>
                <Avatar
                  name={state.user.name}
                  src={state.user.profileImage}
                />

                <div className="mt-6 flex flex-col items-center gap-1 text-center">
                  <p className="text-[18px] font-semibold text-brand-ink">
                    {state.user.name}
                  </p>
                  <p className="text-[14px] font-light text-brand-ink/70">
                    {state.user.email}
                  </p>
                </div>

                <dl className="mt-8 w-full max-w-xs">
                  <div className="flex items-center justify-between border-t border-brand-ink/10 py-3">
                    <dt className="text-[14px] font-light text-brand-ink/60">
                      가입일
                    </dt>
                    <dd className="text-[14px] font-medium text-brand-ink">
                      {formatJoinedDate(state.user.createdAt)}
                    </dd>
                  </div>
                </dl>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
