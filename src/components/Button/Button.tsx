import type { ButtonProps } from './Button.types'

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border border-transparent focus-visible:ring-blue-500',
  secondary:
    'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-300 focus-visible:ring-gray-400',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-transparent focus-visible:ring-red-500',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-transparent focus-visible:ring-gray-400',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

const spinnerSizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

function Spinner({ size }: { size: NonNullable<ButtonProps['size']> }) {
  return (
    <svg
      className={`${spinnerSizeClasses[size]} animate-spin shrink-0`}
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
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  'aria-label': ariaLabel,
  onClick,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      role="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-label={ariaLabel}
      onClick={isDisabled ? undefined : onClick}
      className={[
        'inline-flex items-center justify-center font-medium rounded-md',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading && <Spinner size={size} />}
      {children}
    </button>
  )
}
