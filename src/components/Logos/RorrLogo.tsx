interface RorrLogoProps {
  className?: string
}

export function RorrLogo({ className = '' }: RorrLogoProps) {
  return (
    <span
      className={`font-bold tracking-[0.08em] text-white ${className}`}
      aria-label="RORR"
    >
      RORR
    </span>
  )
}
