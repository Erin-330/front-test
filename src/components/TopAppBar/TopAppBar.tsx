import { useEffect, useRef, useState } from 'react'
import { ReliantLogo } from '../Logos'

interface TopAppBarProps {
  onMenuSelect?: (key: 'help' | 'settings' | 'close') => void
  onClose?: () => void
}

function LockPersonIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M9 11V8a3 3 0 1 1 6 0v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" />
      <path
        d="M12 16.2v1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoreVertIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="10" cy="4" r="1.6" fill="currentColor" />
      <circle cx="10" cy="10" r="1.6" fill="currentColor" />
      <circle cx="10" cy="16" r="1.6" fill="currentColor" />
    </svg>
  )
}

export function TopAppBar({ onMenuSelect, onClose }: TopAppBarProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleSelect = (key: 'help' | 'settings' | 'close') => {
    setOpen(false)
    if (key === 'close') {
      onClose?.()
    }
    onMenuSelect?.(key)
  }

  return (
    <header className="flex items-center justify-between px-4 py-4 sm:px-6">
      <div className="flex items-center gap-2 text-white/90">
        <LockPersonIcon />
        <ReliantLogo className="text-[18px]" />
      </div>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={open}
          className="-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <MoreVertIcon />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => handleSelect('help')}
              className="block w-full px-4 py-2.5 text-left text-[14px] text-brand-ink hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              Help
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleSelect('settings')}
              className="block w-full px-4 py-2.5 text-left text-[14px] text-brand-ink hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              Settings
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleSelect('close')}
              className="block w-full px-4 py-2.5 text-left text-[14px] text-brand-ink hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
