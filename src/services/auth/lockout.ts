const STORAGE_KEY = 'rorr.auth.lockout'
export const MAX_LOGIN_ATTEMPTS = 5
export const LOCKOUT_DURATION_MS = 5 * 60 * 1000

interface LockoutState {
  attempts: number
  lockedUntil?: number
}

function readAll(): Record<string, LockoutState> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, LockoutState>) : {}
  } catch {
    return {}
  }
}

function writeAll(state: Record<string, LockoutState>): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function key(email: string): string {
  return email.trim().toLowerCase()
}

export function getLockoutState(email: string): LockoutState {
  return readAll()[key(email)] ?? { attempts: 0 }
}

export function isLocked(email: string, now: number = Date.now()): boolean {
  const state = getLockoutState(email)
  return Boolean(state.lockedUntil && state.lockedUntil > now)
}

export function getRemainingLockMs(
  email: string,
  now: number = Date.now(),
): number {
  const state = getLockoutState(email)
  if (!state.lockedUntil) return 0
  return Math.max(0, state.lockedUntil - now)
}

export function registerFailedAttempt(
  email: string,
  now: number = Date.now(),
): LockoutState {
  const all = readAll()
  const k = key(email)
  const prev = all[k] ?? { attempts: 0 }
  const attempts = prev.attempts + 1
  const next: LockoutState =
    attempts >= MAX_LOGIN_ATTEMPTS
      ? { attempts, lockedUntil: now + LOCKOUT_DURATION_MS }
      : { attempts }
  all[k] = next
  writeAll(all)
  return next
}

export function clearLockout(email: string): void {
  const all = readAll()
  delete all[key(email)]
  writeAll(all)
}
