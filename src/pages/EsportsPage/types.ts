export interface LiveMatch {
  id: string | number
  matchId?: string | number
  league: string
  isLive: boolean
  teamAName: string
  teamAScore: number
  teamBName: string
  teamBScore: number
}

export interface LiveMatchesResponse {
  data: LiveMatch[]
}

export type NewsCategory = 'UPDATES' | 'TOURNAMENT' | 'HARDWARE' | string

export interface NewsItem {
  id: string | number
  title: string
  category: NewsCategory
  thumbnailUrl: string
  publishedAt: string
  source: string
  summary?: string
}

export interface NewsResponse {
  data: NewsItem[]
  meta: {
    page: number
    limit: number
    total: number
  }
}

export type FeedCategory = 'all' | 'lol' | 'valorant' | 'cs2'

export interface FeedCategoryOption {
  id: FeedCategory
  label: string
  apiParam: string
}
