import type { ButtonHTMLAttributes } from 'react'

function GoogleGLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.68-.06-1.34-.18-1.97H10v3.73h5.39a4.6 4.6 0 0 1-2 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.29Z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H1.06v2.59A10 10 0 0 0 10 20Z"
      />
      <path
        fill="#FBBC05"
        d="M4.4 11.9a6 6 0 0 1 0-3.8V5.51H1.06a10 10 0 0 0 0 8.98L4.4 11.9Z"
      />
      <path
        fill="#EA4335"
        d="M10 3.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.95.99 12.7 0 10 0A10 10 0 0 0 1.06 5.51L4.4 8.1C5.19 5.74 7.4 3.96 10 3.96Z"
      />
    </svg>
  )
}

export type GoogleLoginButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
>

export function GoogleLoginButton({
  className = '',
  ...rest
}: GoogleLoginButtonProps) {
  return (
    <button
      type="button"
      className={[
        'inline-flex items-center justify-center gap-2',
        'rounded-[30px] border border-[#747775] bg-white',
        'px-6 py-3 text-base font-bold text-brand-ink',
        'transition-colors hover:bg-gray-50 active:bg-gray-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#747775]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <GoogleGLogo />
      <span>Sign in with Google</span>
    </button>
  )
}
