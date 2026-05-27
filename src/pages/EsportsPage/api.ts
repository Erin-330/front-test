import type { LiveMatchesResponse, NewsResponse } from './types'

const API_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || ''

function buildUrl(path: string): string {
  if (!API_URL) return path
  return `${API_URL.replace(/\/$/, '')}${path}`
}

export async function fetchLiveMatches(signal?: AbortSignal): Promise<LiveMatchesResponse> {
  const res = await fetch(buildUrl('/api/matches/live'), { signal })
  if (!res.ok) {
    throw new Error(`Failed to load live matches (${res.status})`)
  }
  return (await res.json()) as LiveMatchesResponse
}

export async function fetchNews(
  params: { category: string; page: number; limit: number },
  signal?: AbortSignal,
): Promise<NewsResponse> {
  const search = new URLSearchParams({
    category: params.category,
    page: String(params.page),
    limit: String(params.limit),
  })
  const res = await fetch(buildUrl(`/api/news?${search.toString()}`), { signal })
  if (!res.ok) {
    throw new Error(`Failed to load news (${res.status})`)
  }
  return (await res.json()) as NewsResponse
}
