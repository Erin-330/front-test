import type { ButtonHTMLAttributes } from 'react'

export interface KakaoLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}
