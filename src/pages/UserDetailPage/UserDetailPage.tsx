import { useEffect, useState } from 'react'
import { RorrLogo } from '../../components/Logos'

interface UserDetailPageProps {
  userId: string
  onClose?: () => void
}

interface UserDetail {
  id: string
  name: string
  email: string
  profileImage?: string | null
  createdAt: string
}

type LoadState =
  | { status: 'loading' }
  | { status: 'success'; data: UserDetail }
  | { status: 'error'; code: 'not_found' | 'unauthorized' | 'unknown'; message: string }

const TOKEN_STORAGE_KEY = 'rorr.auth.token'

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
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

function Avatar({ name, profileImage }: { name: string; profileImage?: string | null }) {
  if (profileImage) {
    return (
      <img
        src={profileImage}
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
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setState({ status: 'loading' })
      const token = getAuthToken()
      try {
        const res = await fetch(`/users/${encodeURIComponent(userId)}`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            Accept: 'application/json',
          },
        })

        if (res.status === 404) {
          setState({
            status: 'error',
            code: 'not_found',
            message: '사용자를 찾을 수 없습니다.',
          })
          return
        }
        if (res.status === 401 || res.status === 403) {
          setState({
            status: 'error',
            code: 'unauthorized',
            message: '로그인이 필요합니다.',
          })
          return
        }
        if (!res.ok) {
          setState({
            status: 'error',
            code: 'unknown',
            message: `요청에 실패했습니다. (${res.status})`,
          })
          return
        }

        const data = (await res.json()) as UserDetail
        setState({ status: 'success', data })
      } catch (err) {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          code: 'unknown',
          message: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
        })
      }
    }

    load()
    return () => controller.abort()
  }, [userId])

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
            User
          </h1>

          <div className="mt-10 flex flex-1 flex-col items-center justify-center">
            {state.status === 'loading' && (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center gap-3 text-brand-ink/70"
              >
                <svg
                  className="h-8 w-8 animate-spin text-brand-ink/70"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <p className="text-[14px]">불러오는 중...</p>
              </div>
            )}

            {state.status === 'error' && (
              <div
                role="alert"
                className="flex flex-col items-center gap-2 text-center"
              >
                <p className="text-[18px] font-semibold text-brand-ink">
                  {state.code === 'not_found'
                    ? '사용자를 찾을 수 없습니다'
                    : state.code === 'unauthorized'
                      ? '인증이 필요합니다'
                      : '오류가 발생했습니다'}
                </p>
                <p className="text-[14px] font-light text-brand-ink/70">
                  {state.message}
                </p>
              </div>
            )}

            {state.status === 'success' && (
              <>
                <Avatar name={state.data.name} profileImage={state.data.profileImage} />

                <div className="mt-6 flex flex-col items-center gap-1 text-center">
                  <p className="text-[18px] font-semibold text-brand-ink">
                    {state.data.name}
                  </p>
                  <p className="text-[14px] font-light text-brand-ink/70">
                    {state.data.email}
                  </p>
                  <p className="mt-2 text-[12px] font-light text-brand-ink/60">
                    가입일 {formatDate(state.data.createdAt)}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
