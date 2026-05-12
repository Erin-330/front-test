import type { KakaoLoginButtonProps } from './KakaoLoginButton.types'

const sizeClasses = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

const iconSizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

const spinnerSizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3C6.477 3 2 6.477 2 10.8c0 2.74 1.638 5.145 4.1 6.584l-1.046 3.9a.3.3 0 0 0 .453.326L9.9 19.27C10.587 19.42 11.289 19.5 12 19.5c5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z"
        fill="rgba(0,0,0,0.85)"
      />
    </svg>
  )
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`${className} animate-spin shrink-0`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="rgba(0,0,0,0.85)"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="rgba(0,0,0,0.85)"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function KakaoLoginButton({
  size = 'md',
  loading = false,
  disabled = false,
  children = '카카오 로그인',
  className = '',
  onClick,
  ...rest
}: KakaoLoginButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-label="카카오 로그인"
      onClick={isDisabled ? undefined : onClick}
      className={[
        'inline-flex items-center justify-center font-medium rounded-md',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'bg-[#FEE500] text-[rgba(0,0,0,0.85)] hover:bg-[#F0D900] active:bg-[#E6CE00]',
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading ? (
        <Spinner className={spinnerSizeClasses[size]} />
      ) : (
        <KakaoIcon className={iconSizeClasses[size]} />
      )}
      {children}
    </button>
  )
}
