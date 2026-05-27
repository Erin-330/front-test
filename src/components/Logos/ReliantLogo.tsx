interface ReliantLogoProps {
  className?: string
}

export function ReliantLogo({ className = '' }: ReliantLogoProps) {
  return (
    <span
      className={`font-bold tracking-[0.06em] text-white ${className}`}
      aria-label="Reliant"
    >
      Reliant
    </span>
  )
}
