import { useEffect, useState } from 'react'
import { RorrLogo } from '../../components/Logos'

interface UserDetail {
  id: string
  name: string
  email: string
  image: string | null
}

interface UserDetailPageProps {
  id: string
  onClose?: () => void
}

type FetchState =
  | { status: 'loading' }
  | { status: 'success'; user: UserDetail }
  | { status: 'error'; message: string }

function Avatar({ user }: { user: UserDetail }) {
  const initials = user.name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (user.image) {
    return (
      <img
        src={user.image}
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

export function UserDetailPage({ id, onClose }: UserDetailPageProps) {
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })

    fetch(`/users/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`요청에 실패했습니다 (${res.status})`)
        }
        const data = (await res.json()) as UserDetail
        setState({ status: 'success', user: data })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'
        setState({ status: 'error', message })
      })

    return () => controller.abort()
  }, [id])

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
                불러오는 중…
              </p>
            )}

            {state.status === 'error' && (
              <p
                role="alert"
                className="text-[14px] font-medium text-red-600"
              >
                {state.message}
              </p>
            )}

            {state.status === 'success' && (
              <>
                <Avatar user={state.user} />

                <dl className="mt-6 flex flex-col items-center gap-2 text-center">
                  <div>
                    <dt className="sr-only">이름</dt>
                    <dd className="text-[18px] font-semibold text-brand-ink">
                      {state.user.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">이메일</dt>
                    <dd className="text-[14px] font-light text-brand-ink/70">
                      {state.user.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">ID</dt>
                    <dd className="text-[12px] font-light text-brand-ink/50">
                      ID: {state.user.id}
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
