import type { Match, NewsItem } from './types'
import { FEATURED_NEWS, MOCK_MATCHES, generateMockNews } from './mockData'

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    readonly NEXT_PUBLIC_API_URL?: string
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_API_URL) ||
  ''

const PAGE_LIMIT = 20

export interface FetchNewsArgs {
  page: number
  limit?: number
  gameTitle?: string
  signal?: AbortSignal
}

export interface FetchNewsResult {
  items: NewsItem[]
  page: number
  hasMore: boolean
}

export async function fetchNews({
  page,
  limit = PAGE_LIMIT,
  gameTitle,
  signal,
}: FetchNewsArgs): Promise<FetchNewsResult> {
  if (!API_BASE) {
    await new Promise((resolve) => setTimeout(resolve, 350))
    const items = generateMockNews(page, limit, gameTitle)
    return { items, page, hasMore: page < 5 }
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  if (gameTitle && gameTitle !== 'All') params.set('gameTitle', gameTitle)

  try {
    const res = await fetch(`${API_BASE}/api/news?${params.toString()}`, { signal })
    if (!res.ok) throw new Error(`News request failed: ${res.status}`)
    const data = await res.json()
    const items: NewsItem[] = data.items ?? data.data ?? []
    const hasMore = typeof data.hasMore === 'boolean' ? data.hasMore : items.length === limit
    return { items, page, hasMore }
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error
    const items = generateMockNews(page, limit, gameTitle)
    return { items, page, hasMore: page < 5 }
  }
}

export interface FetchMatchesArgs {
  isLive?: boolean
  league?: string
  signal?: AbortSignal
}

export async function fetchMatches({
  isLive = true,
  league,
  signal,
}: FetchMatchesArgs = {}): Promise<Match[]> {
  if (!API_BASE) {
    await new Promise((resolve) => setTimeout(resolve, 250))
    return MOCK_MATCHES.filter((m) => (isLive ? m.isLive : true)).filter((m) =>
      league ? m.league === league : true,
    )
  }

  const params = new URLSearchParams()
  if (isLive) params.set('isLive', 'true')
  if (league) params.set('league', league)

  try {
    const res = await fetch(`${API_BASE}/api/matches?${params.toString()}`, { signal })
    if (!res.ok) throw new Error(`Matches request failed: ${res.status}`)
    const data = await res.json()
    return (data.items ?? data.data ?? []) as Match[]
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error
    return MOCK_MATCHES.filter((m) => (isLive ? m.isLive : true)).filter((m) =>
      league ? m.league === league : true,
    )
  }
}

export function getFeaturedNews(): NewsItem {
  return FEATURED_NEWS
}
