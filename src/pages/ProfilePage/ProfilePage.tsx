import { Button } from '../../components/Button'
import { RorrLogo } from '../../components/Logos'
import type { AuthUser } from '../../hooks/useAuth'

interface ProfilePageProps {
  user: AuthUser
  onSignOut: () => void
  onClose?: () => void
}

interface ActivityItem {
  id: string
  type: 'league' | 'team' | 'player' | 'reward'
  title: string
  description: string
  timeAgo: string
}

const STATS = [
  { label: '가입일', value: '2024.03.12', hint: '활동 기간 1년 2개월' },
  { label: '활동 수', value: '128', hint: '이번 달 24회' },
  { label: '포인트', value: '3,420', hint: '+180 이번 주' },
] as const

const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'league',
    title: 'Premier League 응원 시작',
    description: '시즌 2025/26 응원 그룹에 합류했습니다',
    timeAgo: '2시간 전',
  },
  {
    id: '2',
    type: 'team',
    title: 'Manchester City 백업',
    description: '응원 팀으로 Manchester City를 선택했습니다',
    timeAgo: '5시간 전',
  },
  {
    id: '3',
    type: 'player',
    title: 'Erling Haaland 픽',
    description: '최애 선수로 Erling Haaland를 등록했습니다',
    timeAgo: '어제',
  },
  {
    id: '4',
    type: 'reward',
    title: '포인트 적립 +120',
    description: '주간 출석 보상이 지급되었습니다',
    timeAgo: '2일 전',
  },
]

const ACTIVITY_ICON: Record<ActivityItem['type'], { bg: string; emoji: string; label: string }> = {
  league: { bg: 'bg-[#e6e8ff]', emoji: '🏆', label: '리그' },
  team: { bg: 'bg-[#ffeede]', emoji: '⚽', label: '팀' },
  player: { bg: 'bg-[#dff3e6]', emoji: '🎯', label: '선수' },
  reward: { bg: 'bg-[#fff2c2]', emoji: '✨', label: '보상' },
}

function Avatar({ user, size = 'md' }: { user: AuthUser; size?: 'md' | 'lg' }) {
  const initials = user.name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const dimensions = size === 'lg' ? 'h-28 w-28 sm:h-32 sm:w-32 text-3xl' : 'h-12 w-12 text-base'
  const ring = size === 'lg' ? 'ring-4 ring-white shadow-[0_8px_24px_rgba(70,56,58,0.25)]' : ''

  if (user.picture) {
    return (
      <img
        src={user.picture}
        alt={`${user.name} 프로필 이미지`}
        className={`${dimensions} ${ring} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${user.name} 기본 프로필 이미지`}
      className={`${dimensions} ${ring} flex items-center justify-center rounded-full bg-gradient-to-br from-[#969cda] to-[#6b73c7] font-semibold text-white`}
    >
      {initials || 'U'}
    </div>
  )
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="flex flex-col items-start rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(70,56,58,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(70,56,58,0.12)] sm:p-5">
      <span className="text-[12px] font-medium uppercase tracking-wide text-brand-ink/50">
        {label}
      </span>
      <span className="mt-2 text-[22px] font-bold leading-none text-brand-ink sm:text-[26px]">
        {value}
      </span>
      <span className="mt-2 text-[12px] font-light text-brand-ink/60">{hint}</span>
    </div>
  )
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const icon = ACTIVITY_ICON[item.type]
  return (
    <li className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-black/[0.03] sm:gap-4 sm:px-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${icon.bg} text-xl`}
        aria-hidden="true"
      >
        <span>{icon.emoji}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-[14px] font-semibold text-brand-ink sm:text-[15px]">
            {item.title}
          </p>
          <span className="shrink-0 text-[11px] font-light text-brand-ink/50 sm:text-[12px]">
            {item.timeAgo}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] font-light text-brand-ink/70">
          {item.description}
        </p>
        <span className="mt-2 inline-flex w-fit items-center rounded-full bg-brand-ink/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-ink/60">
          {icon.label}
        </span>
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
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-5 rounded-2xl bg-brand-card p-5 sm:gap-6 sm:p-8">
          <h1 className="sr-only">User Profile</h1>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#969cda] via-[#7e85c9] to-[#5b639f] p-5 sm:p-7">
            <div
              className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Avatar user={user} size="lg" />
              <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:text-left">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                  <span aria-hidden="true">●</span>
                  Active member
                </span>
                <p className="mt-2 truncate text-[22px] font-bold leading-tight text-white sm:text-[26px]">
                  {user.name}
                </p>
                <p className="mt-1 max-w-full truncate text-[13px] font-light text-white/80 sm:text-[14px]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="flex flex-col rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(70,56,58,0.06)] sm:p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[16px] font-semibold text-brand-ink sm:text-[18px]">
                최근 활동
              </h2>
              <span className="text-[12px] font-light text-brand-ink/50">
                지난 7일
              </span>
            </div>
            <ul className="mt-2 flex flex-col divide-y divide-brand-ink/[0.06]">
              {RECENT_ACTIVITIES.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </ul>
          </div>

          <div className="flex justify-center pt-1 sm:pt-2">
            <Button
              variant="secondary"
              size="lg"
              className="w-full max-w-xs !rounded-[30px] !border-[#747775] !bg-white !text-brand-ink"
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
