import { useState, type FormEvent } from 'react'
import { login } from '../../services/auth'
import type { LoginFailure, LoginSuccessData } from '../../services/auth'

interface EmailPasswordFormProps {
  onSuccess: (data: LoginSuccessData) => void
}

export function EmailPasswordForm({ onSuccess }: EmailPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState<LoginFailure | null>(null)

  function fieldError(field: 'email' | 'password'): string | null {
    if (!failure?.errors) return null
    const match = failure.errors.find((e) => e.field === field)
    return match ? match.reason : null
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setFailure(null)
    const result = await login({ email, password })
    setSubmitting(false)
    if (result.ok) {
      onSuccess(result.data)
      return
    }
    setFailure(result.failure)
  }

  const emailFieldError = fieldError('email')
  const passwordFieldError = fieldError('password')
  const showFormError =
    failure && failure.kind !== 'validation'

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-sm flex-col gap-3"
      noValidate
    >
      <label className="flex flex-col gap-1 text-left text-[13px] text-brand-ink/80">
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          aria-invalid={Boolean(emailFieldError)}
          className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-[14px] text-brand-ink placeholder:text-brand-ink/40 focus:border-white/60 focus:outline-none disabled:opacity-50"
          placeholder="you@example.com"
        />
        {emailFieldError && (
          <span role="alert" className="text-[12px] text-red-400">
            {emailFieldError === 'required'
              ? '이메일을 입력해 주세요.'
              : '잘못된 이메일 형식입니다.'}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-left text-[13px] text-brand-ink/80">
        <span>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
          aria-invalid={Boolean(passwordFieldError)}
          className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-[14px] text-brand-ink placeholder:text-brand-ink/40 focus:border-white/60 focus:outline-none disabled:opacity-50"
          placeholder="••••••••"
        />
        {passwordFieldError && (
          <span role="alert" className="text-[12px] text-red-400">
            {passwordFieldError === 'required'
              ? '비밀번호를 입력해 주세요.'
              : '비밀번호는 최소 8자 이상이어야 합니다.'}
          </span>
        )}
      </label>

      {showFormError && (
        <p role="alert" className="text-[12px] text-red-400">
          {failure.message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex items-center justify-center rounded-[30px] bg-white px-6 py-3 text-base font-bold text-brand-card transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
