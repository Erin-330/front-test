import { Button } from '../../components/Button'
import { RorrLogo } from '../../components/Logos'
import type { AuthUser } from '../../hooks/useAuth'

interface ProfilePageProps {
  user: AuthUser
  onSignOut: () => void
  onClose?: () => void
}

type ActivityType = 'league' | 'team' | 'player' | 'reward'

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  occurredAt: Date
}

const JOIN_DATE = new Date('2024-08-12T09:00:00Z')

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'a1',
    type: 'reward',
    title: '+50 포인트 적립',
    description: '주간 챌린지 완료 보상',
    occurredAt: new Date(Date.now() - 1000 * 60 * 32),
  },
  {
    id: 'a2',
    type: 'player',
    title: '선수 백킹: 손흥민',
    description: '토트넘 vs 첼시 매치 응원',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'a3',
    type: 'team',
    title: '팀 응원: FC Seoul',
    description: 'K리그 1 라운드 22 백킹 완료',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
  },
  {
    id: 'a4',
    type: 'league',
    title: '리그 참여: Premier League',
    description: '새 시즌 백킹을 시작했어요',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: 'a5',
    type: 'reward',
    title: '+20 포인트 적립',
    description: '친구 초대 보너스',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
  },
]

const STATS = {
  activityCount: ACTIVITIES.length + 23,
  points: 1280,
}

function formatJoinDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day

  if (diffMs < minute) return '방금 전'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}분 전`
  if (diffMs < day) return `${Math.floor(diffMs / hour)}시간 전`
  if (diffMs < week) return `${Math.floor(diffMs / day)}일 전`
  return `${Math.floor(diffMs / week)}주 전`
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
        className="h-24 w-24 rounded-full object-cover ring-2 ring-[#969cda]/40"
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${user.name} 기본 프로필 이미지`}
      className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-bg text-2xl font-semibold text-white ring-2 ring-[#969cda]/40"
    >
      {initials || 'U'}
    </div>
  )
}

function ActiveMemberBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#969cda]/15 px-3 py-1 text-[12px] font-semibold text-[#5a62b8]">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-[#5a62b8]"
      />
      Active member
    </span>
  )
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-brand-ink/5 bg-white px-4 py-4 text-center shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0px_2px_8px_0px_rgba(150,156,218,0.18)]">
      <span className="text-[12px] font-medium uppercase tracking-wide text-brand-ink/55">
        {label}
      </span>
      <span className="text-[16px] font-semibold text-brand-ink">{value}</span>
    </div>
  )
}

function ActivityIcon({ type }: { type: ActivityType }) {
  const baseClass =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full'

  if (type === 'league') {
    return (
      <div
        className={`${baseClass} bg-[#969cda]/15 text-[#5a62b8]`}
        aria-label="리그 활동"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 2l2.39 4.84 5.34.78-3.86 3.77.91 5.31L10 14.2l-4.78 2.5.91-5.31L2.27 7.62l5.34-.78L10 2z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  if (type === 'team') {
    return (
      <div
        className={`${baseClass} bg-emerald-100 text-emerald-700`}
        aria-label="팀 활동"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM13 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM2.5 16c0-2.21 2.015-4 4.5-4s4.5 1.79 4.5 4M17.5 16c0-2.21-2.015-4-4.5-4-.527 0-1.032.08-1.5.226"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    )
  }

  if (type === 'player') {
    return (
      <div
        className={`${baseClass} bg-sky-100 text-sky-700`}
        aria-label="선수 활동"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="10"
            cy="7"
            r="3"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M4 17c0-3.31 2.69-6 6-6s6 2.69 6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    )
  }

  return (
    <div
      className={`${baseClass} bg-amber-100 text-amber-700`}
      aria-label="포인트 활동"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 2.5l2.06 4.51 4.94.53-3.7 3.36 1.06 4.85L10 13.3l-4.36 2.45 1.06-4.85L3 7.54l4.94-.53L10 2.5z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

function ActivityRow({ activity }: { activity: ActivityItem }) {
  return (
    <li className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#969cda]/10">
      <ActivityIcon type={activity.type} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-[14px] font-semibold text-brand-ink">
            {activity.title}
          </p>
          <time
            dateTime={activity.occurredAt.toISOString()}
            className="shrink-0 text-[12px] font-medium text-brand-ink/55"
          >
            {formatRelativeTime(activity.occurredAt)}
          </time>
        </div>
        <p className="mt-0.5 truncate text-[13px] font-light text-brand-ink/70">
          {activity.description}
        </p>
      </div>
    </li>
  )
}

export function ProfilePage({ user, onSignOut, onClose }: ProfilePageProps) {
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
        <section className="flex w-full flex-col rounded-2xl bg-brand-card px-6 py-8 sm:px-10">
          <h1 className="text-center text-[24px] font-semibold leading-tight text-brand-ink">
            Profile
          </h1>

          <div className="mt-8 flex flex-col items-center">
            <Avatar user={user} />

            <div className="mt-5 flex flex-col items-center gap-1 text-center">
              <p className="text-[18px] font-semibold text-brand-ink">
                {user.name}
              </p>
              <p className="text-[14px] font-light text-brand-ink/70">
                {user.email}
              </p>
              <div className="mt-2">
                <ActiveMemberBadge />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="가입일" value={formatJoinDate(JOIN_DATE)} />
            <StatCard
              label="활동 수"
              value={`${STATS.activityCount.toLocaleString('ko-KR')}회`}
            />
            <StatCard
              label="포인트"
              value={`${STATS.points.toLocaleString('ko-KR')}P`}
            />
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-[15px] font-semibold text-brand-ink">
                최근 활동
              </h2>
              <span className="text-[12px] font-medium text-brand-ink/55">
                최근 {ACTIVITIES.length}건
              </span>
            </div>
            <ul className="flex flex-col gap-1 rounded-2xl border border-brand-ink/5 bg-white p-2 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04)]">
              {ACTIVITIES.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </ul>
          </div>

          <div className="mt-8 flex w-full justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="w-full max-w-xs !rounded-[30px] !border-[#747775] !bg-white !text-brand-ink transition-colors hover:!bg-[#f5f6ff]"
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
