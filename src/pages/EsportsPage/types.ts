export type GameCategory = 'All' | 'League of Legends' | 'Valorant' | 'CS2'

export interface NewsItem {
  id: string
  title: string
  category: string
  source: string
  thumbnail: string
  publishedAt: string
  isFeatured?: boolean
}

export interface MatchTeam {
  name: string
  shortName: string
  logo: string
  score: number
}

export interface Match {
  id: string
  league: string
  leagueBadge: string
  isLive: boolean
  status: string
  teamA: MatchTeam
  teamB: MatchTeam
}

export interface NewsResponse {
  items: NewsItem[]
  page: number
  hasMore: boolean
}
