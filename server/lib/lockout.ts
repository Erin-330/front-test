const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 5 * 60 * 1000

interface Attempt {
  count: number
  lockedUntil: number
}

const attempts = new Map<string, Attempt>()

export function isLocked(ip: string): { locked: boolean; retryAfterSec: number } {
  const entry = attempts.get(ip)
  if (!entry) return { locked: false, retryAfterSec: 0 }
  const now = Date.now()
  if (entry.lockedUntil > now) {
    return { locked: true, retryAfterSec: Math.ceil((entry.lockedUntil - now) / 1000) }
  }
  if (entry.lockedUntil > 0 && entry.lockedUntil <= now) {
    // Window expired — clear and let user retry fresh.
    attempts.delete(ip)
  }
  return { locked: false, retryAfterSec: 0 }
}

export function recordFailure(ip: string): { count: number; locked: boolean } {
  const entry = attempts.get(ip) ?? { count: 0, lockedUntil: 0 }
  entry.count += 1
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS
  }
  attempts.set(ip, entry)
  return { count: entry.count, locked: entry.lockedUntil > Date.now() }
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip)
}
