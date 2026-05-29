import { useCallback, useEffect, useState } from 'react'
import { PitchInteractiveLogo, RorrLogo } from '../../components/Logos'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  status: 'active' | 'inactive'
  bio?: string
}

interface UserDetailPageProps {
  userId: string
  onBack?: () => void
  onEdit?: (user: User) => void
  onClose?: () => void
  fetchUser?: (id: string) => Promise<User>
}

async function defaultFetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${encodeURIComponent(id)}`)
  if (!res.ok) {
    throw new Error(`Failed to load user (status ${res.status})`)
  }
  return (await res.json()) as User
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
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

function Avatar({ user }: { user: User }) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={`${user.name} profile`}
        className="h-24 w-24 rounded-full object-cover ring-1 ring-brand-ink/10 sm:h-28 sm:w-28"
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${user.name} default profile`}
      className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-bg text-2xl font-semibold text-white sm:h-28 sm:w-28 sm:text-3xl"
    >
      {getInitials(user.name)}
    </div>
  )
}

function StatusBadge({ status }: { status: User['status'] }) {
  const isActive = status === 'active'
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium',
        isActive
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-gray-200 text-gray-600',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'h-1.5 w-1.5 rounded-full',
          isActive ? 'bg-emerald-500' : 'bg-gray-400',
        ].join(' ')}
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

function Spinner() {
  return (
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
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-brand-ink/10 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4">
      <dt className="text-[13px] font-medium uppercase tracking-wide text-brand-ink/60">
        {label}
      </dt>
      <dd className="text-[14px] font-normal text-brand-ink sm:text-right">
        {value}
      </dd>
    </div>
  )
}

export function UserDetailPage({
  userId,
  onBack,
  onEdit,
  onClose,
  fetchUser = defaultFetchUser,
}: UserDetailPageProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const next = await fetchUser(userId)
      setUser(next)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [fetchUser, userId])

  useEffect(() => {
    void load()
  }, [load])

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
        <section className="flex w-full flex-col rounded-2xl bg-brand-card px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] font-medium text-brand-ink transition-colors hover:bg-brand-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/40"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 4l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
            <h1 className="text-center text-[20px] font-semibold leading-tight text-brand-ink sm:text-[24px]">
              User Detail
            </h1>
            <span aria-hidden="true" className="w-[64px]" />
          </div>

          <div className="mt-6 flex flex-1 flex-col">
            {loading && (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-1 flex-col items-center justify-center gap-3 py-16"
              >
                <Spinner />
                <p className="text-[14px] font-light text-brand-ink/70">
                  Loading user…
                </p>
              </div>
            )}

            {!loading && error && (
              <div
                role="alert"
                className="flex flex-1 flex-col items-center justify-center gap-4 py-16"
              >
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center">
                  <p className="text-[14px] font-medium text-red-700">
                    Failed to load user
                  </p>
                  <p className="mt-1 text-[13px] font-light text-red-600/90">
                    {error}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void load()}
                  className="inline-flex h-10 items-center justify-center rounded-[30px] bg-[#969cda] px-5 text-[14px] font-semibold text-white shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#afb5ea] active:bg-[#7e85c9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda] focus-visible:ring-offset-2"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && user && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
                  <Avatar user={user} />
                  <div className="flex flex-col items-center gap-2 sm:items-start">
                    <h2 className="text-[20px] font-semibold leading-tight text-brand-ink sm:text-[22px]">
                      {user.name}
                    </h2>
                    <p className="text-[14px] font-light text-brand-ink/70">
                      {user.email}
                    </p>
                    <StatusBadge status={user.status} />
                  </div>
                </div>

                {user.bio && (
                  <p className="rounded-xl bg-white/60 px-4 py-3 text-[14px] font-light leading-relaxed text-brand-ink/80">
                    {user.bio}
                  </p>
                )}

                <dl className="rounded-xl bg-white/60 px-4 sm:px-6">
                  <DetailRow label="User ID" value={user.id} />
                  <DetailRow label="Email" value={user.email} />
                  <DetailRow
                    label="Created"
                    value={formatDate(user.createdAt)}
                  />
                  <DetailRow
                    label="Status"
                    value={<StatusBadge status={user.status} />}
                  />
                </dl>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onBack}
                    className="h-[44px] w-full rounded-[30px] border border-[#969cda] bg-white px-5 text-[14px] font-semibold text-[#46383a] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#f5f6ff] active:bg-[#eceeff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda] focus-visible:ring-offset-2 sm:w-auto sm:min-w-[140px]"
                  >
                    Back to list
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit?.(user)}
                    className="h-[44px] w-full rounded-[30px] bg-[#969cda] px-5 text-[14px] font-semibold text-white shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#afb5ea] active:bg-[#7e85c9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda] focus-visible:ring-offset-2 sm:w-auto sm:min-w-[140px]"
                  >
                    Edit profile
                  </button>
                </div>
              </div>
            )}
          </div>

          <footer className="mt-10 flex flex-col items-center gap-3">
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
