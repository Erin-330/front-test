import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'

export interface OutlinedTextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  errorText?: string
  helperText?: string
  trailing?: ReactNode
}

export const OutlinedTextField = forwardRef<
  HTMLInputElement,
  OutlinedTextFieldProps
>(function OutlinedTextField(
  {
    label,
    errorText,
    helperText,
    trailing,
    id,
    value,
    defaultValue,
    onFocus,
    onBlur,
    onChange,
    className = '',
    disabled,
    type = 'text',
    ...rest
  },
  ref,
) {
  const reactId = useId()
  const inputId = id ?? `tf-${reactId}`
  const helperId = `${inputId}-help`

  const [focused, setFocused] = useState(false)
  const [internalValue, setInternalValue] = useState<string>(
    typeof defaultValue === 'string' ? defaultValue : '',
  )

  const isControlled = value !== undefined
  const currentValue = isControlled ? String(value ?? '') : internalValue
  const hasValue = currentValue.length > 0
  const floating = focused || hasValue
  const invalid = Boolean(errorText)

  const borderColor = invalid
    ? 'border-clarity-danger'
    : focused
      ? 'border-trust'
      : 'border-clarity-border hover:border-clarity-ink/60'
  const ringColor = focused && !invalid ? 'ring-1 ring-trust' : ''
  const labelColor = invalid
    ? 'text-clarity-danger'
    : focused
      ? 'text-trust'
      : 'text-clarity-muted'

  return (
    <div className={`w-full ${className}`}>
      <div
        className={[
          'relative flex h-14 items-center rounded-clarity border bg-clarity-surface',
          'transition-colors duration-150',
          borderColor,
          ringColor,
          disabled ? 'opacity-60' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={isControlled ? value : internalValue}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={errorText || helperText ? helperId : undefined}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value)
            onChange?.(e)
          }}
          placeholder=" "
          className={[
            'peer h-full w-full bg-transparent px-4 pt-3 text-[15px] font-medium',
            'text-clarity-ink placeholder-transparent caret-trust',
            'focus:outline-none disabled:cursor-not-allowed',
            trailing ? 'pr-12' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        <label
          htmlFor={inputId}
          className={[
            'pointer-events-none absolute left-3 px-1 bg-clarity-surface',
            'font-grotesk transition-all duration-150',
            floating
              ? 'top-0 -translate-y-1/2 text-[12px]'
              : 'top-1/2 -translate-y-1/2 text-[15px]',
            labelColor,
          ].join(' ')}
        >
          {label}
        </label>
        {trailing ? (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {trailing}
          </div>
        ) : null}
      </div>
      {(errorText || helperText) && (
        <p
          id={helperId}
          className={[
            'mt-1.5 pl-3 text-[12px] font-grotesk',
            invalid ? 'text-clarity-danger' : 'text-clarity-muted',
          ].join(' ')}
        >
          {errorText || helperText}
        </p>
      )}
    </div>
  )
})
