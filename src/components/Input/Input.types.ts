import type { InputHTMLAttributes, ReactNode } from 'react'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  size?: InputSize
  fullWidth?: boolean
  endAdornment?: ReactNode
}
