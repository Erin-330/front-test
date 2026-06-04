interface PitchInteractiveLogoProps {
  className?: string
}

export function PitchInteractiveLogo({
  className = '',
}: PitchInteractiveLogoProps) {
  return (
    <div
      className={`flex flex-col items-center gap-1 text-[#46383a] ${className}`}
      aria-label="Pitch Interactive"
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14 12h6.5a4.5 4.5 0 0 1 0 9H17v7h-3V12Zm3 2.7v3.6h3.4a1.8 1.8 0 0 0 0-3.6H17Z"
          fill="currentColor"
        />
      </svg>
      <span className="text-[10px] font-semibold tracking-[0.18em] uppercase">
        Pitch Interactive
      </span>
    </div>
  )
}
