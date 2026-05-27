interface TopAppBarProps {
  onMenu?: () => void
  onSearch?: () => void
  onNotifications?: () => void
}

export function TopAppBar({ onMenu, onSearch, onNotifications }: TopAppBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-azure-border bg-azure-bg/95 px-4 backdrop-blur-md">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-azure-ink transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-trust"
      >
        <span className="material-icons text-[24px]">menu</span>
      </button>

      <h1 className="font-hanken text-[16px] font-extrabold tracking-[0.18em] text-white">
        ESPORTS CENTRAL
      </h1>

      <div className="-mr-2 flex items-center">
        <button
          type="button"
          onClick={onSearch}
          aria-label="Search"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-azure-ink transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-trust"
        >
          <span className="material-icons text-[22px]">search</span>
        </button>
        <button
          type="button"
          onClick={onNotifications}
          aria-label="Notifications"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-azure-ink transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-trust"
        >
          <span className="material-icons text-[22px]">notifications</span>
        </button>
      </div>
    </header>
  )
}
