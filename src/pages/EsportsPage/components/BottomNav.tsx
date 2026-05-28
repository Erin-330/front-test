export type BottomNavTab = 'home' | 'news' | 'matches' | 'profile'

interface BottomNavProps {
  active: BottomNavTab
  onChange: (next: BottomNavTab) => void
}

interface TabConfig {
  id: BottomNavTab
  label: string
  icon: (active: boolean) => JSX.Element
}

const tabs: TabConfig[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          fill={active ? 'currentColor' : 'none'}
          fillOpacity={active ? 0.12 : 0}
        />
      </svg>
    ),
  },
  {
    id: 'news',
    label: 'News',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3.5"
          y="4.5"
          width="14"
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          fill={active ? 'currentColor' : 'none'}
          fillOpacity={active ? 0.12 : 0}
        />
        <path d="M7 9h7M7 13h7M7 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M17.5 8h2A1.5 1.5 0 0 1 21 9.5V18a1.5 1.5 0 0 1-3 0V8Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'matches',
    label: 'Matches',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          fill={active ? 'currentColor' : 'none'}
          fillOpacity={active ? 0.12 : 0}
        />
        <path
          d="m4.5 8 4 2-1 4-3-1M19.5 8l-4 2 1 4 3-1M12 4v3M9.5 19.5l1-2.5h3l1 2.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="12"
          cy="9"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          fill={active ? 'currentColor' : 'none'}
          fillOpacity={active ? 0.12 : 0}
        />
        <path
          d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-30 grid grid-cols-4 border-t border-azure-border bg-white pb-[env(safe-area-inset-bottom)]"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(tab.id)}
            className={[
              'flex flex-col items-center justify-center gap-1 py-2.5 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure-primary',
              isActive ? 'text-azure-primary' : 'text-azure-muted hover:text-azure-ink',
            ].join(' ')}
          >
            {tab.icon(isActive)}
            <span
              className={`font-hanken text-[11px] ${
                isActive ? 'font-bold' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
