import { useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { RorrLogo } from '../../components/Logos'
import type { AuthUser } from '../../hooks/useAuth'

interface UserDetailPageProps {
  user: AuthUser
  onSignOut: () => void
  onClose?: () => void
  onBack?: () => void
  onEditLeagues?: () => void
  onEditTeams?: () => void
  onEditPlayers?: () => void
}

const SELECTION_STORAGE_KEYS = {
  leagues: 'rorr.selections.leagues',
  teams: 'rorr.selections.teams',
  players: 'rorr.selections.players',
} as const

function readSelectionCount(key: string): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return 0
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch {
    return 0
  }
}

function initialsOf(name: string): string {
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

function Avatar({ user }: { user: AuthUser }) {
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
      {initialsOf(user.name)}
    </div>
  )
}

function ChevronRight() {
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="none"
      aria-hidden="true"
      className="text-brand-ink/40"
    >
      <path
        d="M1 1l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white px-3 py-4 shadow-[0px_2px_2px_rgba(0,0,0,0.04)]">
      <p className="text-[20px] font-semibold leading-none text-brand-ink">
        {value}
      </p>
      <p className="mt-1 text-[12px] font-light text-brand-ink/60">{label}</p>
    </div>
  )
}

function Row({
  label,
  value,
  onClick,
  actionLabel,
}: {
  label: string
  value?: string | number
  onClick?: () => void
  actionLabel?: string
}) {
  const interactive = Boolean(onClick)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      aria-label={actionLabel ?? label}
      className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
        interactive
          ? 'hover:bg-brand-ink/[0.03] focus:outline-none focus-visible:bg-brand-ink/[0.05]'
          : 'cursor-default'
      }`}
    >
      <span className="text-[14px] font-normal text-brand-ink">{label}</span>
      <span className="flex items-center gap-2 text-[14px] font-light text-brand-ink/70">
        {value !== undefined && <span>{value}</span>}
        {interactive && <ChevronRight />}
      </span>
    </button>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <div className="flex w-full items-center justify-between px-4 py-3">
      <div className="flex flex-col">
        <span className="text-[14px] font-normal text-brand-ink">{label}</span>
        {description && (
          <span className="mt-0.5 text-[12px] font-light text-brand-ink/60">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-[24px] w-[42px] shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#969cda] focus-visible:ring-offset-2 ${
          checked ? 'bg-[#969cda]' : 'bg-brand-ink/20'
        }`}
      >
        <span
          className={`absolute top-[2px] inline-block h-[20px] w-[20px] rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-[20px]' : 'translate-x-[2px]'
          }`}
        />
      </button>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex w-full flex-col">
      <h2 className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-ink/60">
        {title}
      </h2>
      <div className="divide-y divide-brand-ink/[0.08] overflow-hidden rounded-xl bg-white shadow-[0px_2px_2px_rgba(0,0,0,0.04)]">
        {children}
      </div>
    </section>
  )
}

export function UserDetailPage({
  user,
  onSignOut,
  onClose,
  onBack,
  onEditLeagues,
  onEditTeams,
  onEditPlayers,
}: UserDetailPageProps) {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(false)

  const counts = useMemo(
    () => ({
      leagues: readSelectionCount(SELECTION_STORAGE_KEYS.leagues),
      teams: readSelectionCount(SELECTION_STORAGE_KEYS.teams),
      players: readSelectionCount(SELECTION_STORAGE_KEYS.players),
    }),
    [],
  )

  const joinedDate = useMemo(() => {
    const today = new Date()
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  return (
    <div className="flex min-h-full flex-col bg-brand-bg">
      <header className="flex items-center justify-between px-6 py-5 opacity-[0.66] sm:px-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="-ml-2 inline-flex h-8 w-8 items-center justify-center text-white transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M12 4l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <RorrLogo className="text-xl" />
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 inline-flex h-8 w-8 items-center justify-center text-white transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
        <section className="flex w-full flex-col rounded-2xl bg-brand-card px-6 py-8 sm:px-10">
          <h1 className="text-center text-[24px] font-semibold leading-tight text-brand-ink">
            My Account
          </h1>

          <div className="mt-6 flex flex-col items-center">
            <Avatar user={user} />
            <div className="mt-4 flex flex-col items-center gap-1 text-center">
              <p className="text-[18px] font-semibold text-brand-ink">
                {user.name}
              </p>
              <p className="text-[14px] font-light text-brand-ink/70">
                {user.email}
              </p>
              <span className="mt-2 inline-flex items-center rounded-full bg-[#969cda]/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#5b62b3]">
                Free plan
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <StatTile label="Leagues" value={counts.leagues} />
            <StatTile label="Teams" value={counts.teams} />
            <StatTile label="Players" value={counts.players} />
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <Section title="Account">
              <Row label="Name" value={user.name} />
              <Row label="Email" value={user.email} />
              <Row label="Joined" value={joinedDate} />
              <Row label="Plan" value="Free" />
            </Section>

            <Section title="My Backs">
              <Row
                label="Leagues"
                value={counts.leagues}
                onClick={onEditLeagues}
                actionLabel="Edit leagues"
              />
              <Row
                label="Teams"
                value={counts.teams}
                onClick={onEditTeams}
                actionLabel="Edit teams"
              />
              <Row
                label="Players"
                value={counts.players}
                onClick={onEditPlayers}
                actionLabel="Edit players"
              />
            </Section>

            <Section title="Notifications">
              <ToggleRow
                label="Push notifications"
                description="Match alerts and live score updates"
                checked={pushEnabled}
                onChange={setPushEnabled}
              />
              <ToggleRow
                label="Email digest"
                description="Weekly recap from your backed leagues"
                checked={emailEnabled}
                onChange={setEmailEnabled}
              />
            </Section>
          </div>

          <div className="mt-8 w-full">
            <Button
              variant="secondary"
              size="lg"
              className="w-full !rounded-[30px] !border-[#747775] !bg-white !text-brand-ink"
              onClick={onSignOut}
            >
              Sign out
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
