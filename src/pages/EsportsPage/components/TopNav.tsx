interface TopNavProps {
  onMenu?: () => void
  onSearch?: () => void
  onNotifications?: () => void
  unreadCount?: number
}

export function TopNav({ onMenu, onSearch, onNotifications, unreadCount = 0 }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-azure-primary px-4 text-white shadow-sm">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenu}
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 active:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <h1 className="font-hanken text-[16px] font-extrabold uppercase tracking-[0.12em]">
        Esports Central
      </h1>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Search"
          onClick={onSearch}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 active:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="m20 20-3.5-3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Notifications"
          onClick={onNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 active:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 8a6 6 0 0 1 12 0v4l1.5 3h-15L6 12V8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M10 18a2 2 0 1 0 4 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-azure-live px-1 text-[10px] font-bold leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
