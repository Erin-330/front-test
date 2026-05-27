import type { NewsCategory } from './types'

export function formatTimeAgo(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const diffSec = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))

  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  const diffWk = Math.floor(diffDay / 7)
  if (diffWk < 4) return `${diffWk}w ago`
  const diffMo = Math.floor(diffDay / 30)
  if (diffMo < 12) return `${diffMo}mo ago`
  const diffYr = Math.floor(diffDay / 365)
  return `${diffYr}y ago`
}

export function categoryBadgeClasses(category: NewsCategory): string {
  const upper = String(category).toUpperCase()
  if (upper === 'UPDATES') {
    return 'bg-azure-trust/20 text-[#5b8def] border border-azure-trust/40'
  }
  if (upper === 'TOURNAMENT') {
    return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
  }
  if (upper === 'HARDWARE') {
    return 'bg-white/10 text-gray-200 border border-white/15'
  }
  return 'bg-white/10 text-gray-200 border border-white/15'
}
