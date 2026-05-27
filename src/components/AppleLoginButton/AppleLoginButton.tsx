import type { ButtonHTMLAttributes } from 'react'

function AppleLogo() {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
      fill="currentColor"
    >
      <path d="M14.94 10.62c-.02-2.27 1.85-3.36 1.93-3.41-1.05-1.54-2.69-1.75-3.27-1.78-1.39-.14-2.71.82-3.42.82-.71 0-1.8-.8-2.95-.78-1.52.02-2.92.88-3.7 2.24-1.58 2.74-.4 6.79 1.13 9.01.76 1.09 1.66 2.32 2.85 2.27 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.71 1.23-.02 2.02-1.11 2.78-2.21.88-1.27 1.24-2.5 1.26-2.57-.03-.01-2.41-.92-2.43-3.66h-.14ZM12.66 3.94c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.59.68-1.1 1.76-.96 2.8 1.01.08 2.04-.51 2.68-1.28Z" />
    </svg>
  )
}

export type AppleLoginButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
>

export function AppleLoginButton({
  className = '',
  ...rest
}: AppleLoginButtonProps) {
  return (
    <button
      type="button"
      className={[
        'inline-flex items-center justify-center gap-2',
        'rounded-[30px] border border-black bg-black',
        'px-6 py-3 text-base font-bold text-white',
        'transition-colors hover:bg-[#1a1a1a] active:bg-[#2a2a2a]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <AppleLogo />
      <span>Sign in with Apple</span>
    </button>
  )
}
