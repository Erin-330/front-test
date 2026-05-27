import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base: IconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8a6 6 0 0 1 12 0v4l1.6 3H4.4L6 12z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}

export function NewsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </svg>
  )
}

export function MatchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4v6a6 6 0 0 0 12 0V4" />
      <path d="M4 4h4M16 4h4" />
      <path d="M12 16v4M8 20h8" />
    </svg>
  )
}

export function ProfileIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}
