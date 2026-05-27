export type BottomTab = 'home' | 'news' | 'matches' | 'profile'

interface BottomNavigationProps {
  active: BottomTab
  onChange: (tab: BottomTab) => void
}

interface TabConfig {
  id: BottomTab
  label: string
  icon: string
}

const TABS: TabConfig[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'news', label: 'News', icon: 'article' },
  { id: 'matches', label: 'Matches', icon: 'sports_esports' },
  { id: 'profile', label: 'Profile', icon: 'person' },
]

export function BottomNavigation({ active, onChange }: BottomNavigationProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-azure-border bg-azure-bg/95 backdrop-blur-md"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-[780px] items-stretch justify-around">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'flex w-full flex-col items-center gap-0.5 py-2.5 font-hanken text-[10px] font-semibold transition-colors focus:outline-none',
                  isActive ? 'text-white' : 'text-azure-ink-muted hover:text-white',
                ].join(' ')}
              >
                <span
                  className={[
                    'material-icons text-[22px] transition-colors',
                    isActive ? 'text-azure-trust-light' : 'text-azure-ink-muted',
                  ].join(' ')}
                >
                  {tab.icon}
                </span>
                <span className="uppercase tracking-wider">{tab.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
