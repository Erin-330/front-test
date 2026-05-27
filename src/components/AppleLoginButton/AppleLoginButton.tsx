import type { ButtonHTMLAttributes } from 'react'

function AppleLogo() {
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
        fill="currentColor"
        d="M13.62 10.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.63-1.71-3.2-1.73-1.36-.14-2.66.8-3.35.8-.7 0-1.76-.78-2.9-.76-1.49.02-2.87.87-3.64 2.2-1.55 2.7-.4 6.68 1.12 8.87.74 1.07 1.61 2.28 2.75 2.23 1.1-.04 1.52-.71 2.86-.71s1.71.71 2.89.69c1.19-.02 1.94-1.09 2.67-2.17.84-1.24 1.18-2.45 1.2-2.51-.02-.01-2.31-.89-2.33-3.6Zm-2.18-6.6c.61-.74 1.02-1.77.9-2.79-.88.04-1.94.58-2.57 1.32-.56.66-1.05 1.7-.92 2.7.98.08 1.99-.5 2.59-1.23Z"
      />
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
        'inline-flex w-full items-center justify-center gap-2',
        'rounded-[30px] border border-black bg-white',
        'px-6 py-3 text-base font-bold text-black',
        'transition-colors hover:bg-gray-50 active:bg-gray-100',
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
