import { forwardRef, useId } from 'react'
import type { InputProps } from './Input.types'

const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3.5 text-sm',
  lg: 'h-12 px-4 text-base',
}

const adornmentPaddingClasses = {
  sm: 'pr-8',
  md: 'pr-10',
  lg: 'pr-11',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    size = 'md',
    fullWidth = false,
    endAdornment,
    className = '',
    id: externalId,
    ...rest
  },
  ref
) {
  const generatedId = useId()
  const id = externalId ?? generatedId
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={[
            'block rounded-md border bg-white text-gray-900',
            'placeholder:text-gray-400',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            error
              ? 'border-red-400 focus-visible:ring-red-500'
              : 'border-gray-300 focus-visible:ring-blue-500',
            sizeClasses[size],
            endAdornment ? adornmentPaddingClasses[size] : '',
            fullWidth ? 'w-full' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {endAdornment && (
          <div className="absolute right-3 inset-y-0 flex items-center">{endAdornment}</div>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={hintId} className="mt-1.5 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  )
})
