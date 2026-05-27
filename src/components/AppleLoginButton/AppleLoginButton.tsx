import type { ButtonHTMLAttributes } from 'react'

function AppleLogo() {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M13.6 10.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.1 1.2 9.5.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.8 1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.4-.9-2.4-3.6Zm-2.3-6.7c.6-.8 1.1-1.9 1-3-1 0-2.2.6-2.9 1.4-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.5 2.9-1.3Z" />
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
        'transition-colors hover:bg-neutral-800 active:bg-neutral-900',
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
