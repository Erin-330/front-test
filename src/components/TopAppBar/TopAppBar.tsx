import { useEffect, useRef, useState } from 'react'

interface TopAppBarProps {
  title?: string
  onMore?: (action: string) => void
}

function LockPersonIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6.26a6 6 0 0 1-.26-1.75 6 6 0 0 1 6-6c.69 0 1.36.12 2 .34V10a2 2 0 0 0-2-2Zm-9 0V6a3 3 0 0 1 6 0v2H9Z"
        fill="currentColor"
      />
      <path
        d="M18 14a4 4 0 0 0-4 4c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4Zm0 1.6c.77 0 1.4.63 1.4 1.4s-.63 1.4-1.4 1.4-1.4-.63-1.4-1.4.63-1.4 1.4-1.4Zm0 5.6c-1 0-1.86-.5-2.4-1.27.03-.79 1.6-1.23 2.4-1.23s2.37.44 2.4 1.23c-.54.77-1.4 1.27-2.4 1.27Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MoreVertIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function TopAppBar({ title = 'Reliant', onMore }: TopAppBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  const handleAction = (action: string) => {
    setMenuOpen(false)
    onMore?.(action)
  }

  return (
    <header className="relative flex h-14 items-center justify-between bg-[#1976D2] px-2 text-white shadow-sm">
      <button
        type="button"
        aria-label="Security"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/95 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <LockPersonIcon />
      </button>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold tracking-wide">
        {title}
      </h1>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/95 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <MoreVertIcon />
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-1 top-12 z-20 min-w-[160px] overflow-hidden rounded-md bg-white text-gray-800 shadow-lg ring-1 ring-black/5"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => handleAction('help')}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              Help
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleAction('about')}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              About
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
