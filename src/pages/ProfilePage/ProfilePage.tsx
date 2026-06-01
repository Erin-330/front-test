import { useMemo } from 'react'
import { Button } from '../../components/Button'
import { RorrLogo } from '../../components/Logos'
import type { AuthUser } from '../../hooks/useAuth'

interface ProfilePageProps {
  user: AuthUser
  onSignOut: () => void
  onClose?: () => void
}

type ConnectionStatus = 'connected' | 'disconnected'

interface McpService {
  key: string
  name: string
  tools: number
  description: string
  status: ConnectionStatus
  accent: string
  icon: string
}

interface ActivityItem {
  id: string
  type: 'infra' | 'backend' | 'web' | 'extension'
  title: string
  detail: string
  time: string
}

const MCP_SERVICES: McpService[] = [
  {
    key: 'infra',
    name: 'Infra MCP',
    tools: 11,
    description: 'Terraform 코드 생성 및 인프라 변경 관리',
    status: 'connected',
    accent: '#969cda',
    icon: '🏗️',
  },
  {
    key: 'backend',
    name: 'Backend MCP',
    tools: 5,
    description: 'Lambda → Express 마이그레이션 · NestJS API scaffolding',
    status: 'connected',
    accent: '#7fb38a',
    icon: '⚙️',
  },
  {
    key: 'web',
    name: 'Web MCP',
    tools: 1,
    description: '웹 페이지 / 사이트 생성',
    status: 'connected',
    accent: '#e0a96d',
    icon: '🌐',
  },
  {
    key: 'extension',
    name: 'Extension MCP',
    tools: 1,
    description: '브라우저 익스텐션 생성',
    status: 'disconnected',
    accent: '#c478d4',
    icon: '🧩',
  },
]

const ACTIVITY_LOG: ActivityItem[] = [
  {
    id: 'a1',
    type: 'infra',
    title: 'Terraform 모듈 생성',
    detail: 'Infra MCP · ap-northeast-2 VPC 모듈 추가',
    time: '2시간 전',
  },
  {
    id: 'a2',
    type: 'backend',
    title: 'NestJS API scaffolding',
    detail: 'Backend MCP · /users 리소스 컨트롤러·서비스 생성',
    time: '어제',
  },
  {
    id: 'a3',
    type: 'web',
    title: '랜딩 페이지 배포',
    detail: 'Web MCP · marketing.rorr.club 정적 호스팅',
    time: '3일 전',
  },
  {
    id: 'a4',
    type: 'extension',
    title: '브라우저 익스텐션 빌드',
    detail: 'Extension MCP · Chrome MV3 패키지 생성',
    time: '지난주',
  },
]

const ACTIVITY_ICON: Record<ActivityItem['type'], string> = {
  infra: '🏗️',
  backend: '⚙️',
  web: '🌐',
  extension: '🧩',
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
        className="h-20 w-20 rounded-full object-cover ring-2 ring-white sm:h-24 sm:w-24"
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${user.name} 기본 프로필 이미지`}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-[#969cda] text-2xl font-semibold text-white ring-2 ring-white sm:h-24 sm:w-24"
    >
      {initials || 'U'}
    </div>
  )
}

function StatusDot({ status }: { status: ConnectionStatus }) {
  const isOn = status === 'connected'
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium">
      <span
        aria-hidden="true"
        className={[
          'inline-block h-2 w-2 rounded-full',
          isOn
            ? 'bg-[#3fbf6b] shadow-[0_0_0_3px_rgba(63,191,107,0.18)]'
            : 'bg-gray-400',
        ].join(' ')}
      />
      <span className={isOn ? 'text-[#2f8f51]' : 'text-gray-500'}>
        {isOn ? 'Connected' : 'Disconnected'}
      </span>
    </span>
  )
}

function McpCard({ service }: { service: McpService }) {
  return (
    <article
      className="group relative flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
      aria-label={`${service.name} 카드`}
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-5 h-6 w-1 rounded-r-full"
        style={{ backgroundColor: service.accent }}
      />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
            style={{ backgroundColor: `${service.accent}22`, color: service.accent }}
          >
            {service.icon}
          </span>
          <div>
            <h3 className="text-[15px] font-semibold text-brand-ink">
              {service.name}
            </h3>
            <p className="text-[12px] text-brand-ink/60">
              {service.tools} {service.tools === 1 ? 'tool' : 'tools'}
            </p>
          </div>
        </div>
        <StatusDot status={service.status} />
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-brand-ink/70">
        {service.description}
      </p>
    </article>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:items-start sm:px-5">
      <span className="text-[11px] uppercase tracking-wide text-brand-ink/50">
        {label}
      </span>
      <span className="mt-1 text-[18px] font-semibold text-brand-ink sm:text-[20px]">
        {value}
      </span>
    </div>
  )
}

export function ProfilePage({ user, onSignOut, onClose }: ProfilePageProps) {
  const totalTools = useMemo(
    () => MCP_SERVICES.reduce((sum, s) => sum + s.tools, 0),
    [],
  )

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

      <main className="flex flex-1 px-4 pb-6 sm:px-6">
        <section className="flex w-full flex-col gap-6 rounded-2xl bg-brand-card px-5 py-8 sm:px-8 sm:py-10">
          {/* 1. 프로필 헤더 */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Avatar user={user} />
            <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
              <h1 className="text-[22px] font-semibold text-brand-ink sm:text-[24px]">
                {user.name}
              </h1>
              <p className="text-[14px] font-light text-brand-ink/70">
                {user.email}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3fbf6b]/15 px-3 py-1 text-[12px] font-semibold text-[#2f8f51]">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[#3fbf6b]"
                />
                Active member
              </span>
            </div>
          </div>

          {/* 2. 연결된 MCP 서비스 그리드 */}
          <section aria-labelledby="mcp-heading" className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2
                id="mcp-heading"
                className="text-[16px] font-semibold text-brand-ink"
              >
                Connected MCP Services
              </h2>
              <span className="text-[12px] text-brand-ink/60">
                {totalTools} tools total
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MCP_SERVICES.map((service) => (
                <McpCard key={service.key} service={service} />
              ))}
            </div>
          </section>

          {/* 3. 활동 통계 */}
          <section aria-labelledby="stats-heading" className="flex flex-col gap-3">
            <h2
              id="stats-heading"
              className="text-[16px] font-semibold text-brand-ink"
            >
              Activity Stats
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="가입일" value="2025.11.20" />
              <StatBox label="활동 수" value="128" />
              <StatBox label="포인트" value="2,340" />
            </div>
          </section>

          {/* 4. 최근 활동 내역 */}
          <section
            aria-labelledby="activity-heading"
            className="flex flex-col gap-3"
          >
            <h2
              id="activity-heading"
              className="text-[16px] font-semibold text-brand-ink"
            >
              Recent Activity
            </h2>
            <ol className="relative ml-2 flex flex-col gap-4 border-l border-black/10 pl-5">
              {ACTIVITY_LOG.map((item) => (
                <li key={item.id} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[30px] flex h-7 w-7 items-center justify-center rounded-full bg-white text-[13px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
                  >
                    {ACTIVITY_ICON[item.type]}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[14px] font-semibold text-brand-ink">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-brand-ink/60">
                      {item.detail}
                    </p>
                    <p className="text-[11px] text-brand-ink/40">{item.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-2 flex justify-center">
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
