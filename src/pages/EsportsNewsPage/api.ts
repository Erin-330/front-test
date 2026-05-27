export type NewsCategory = 'all' | 'lol' | 'valorant' | 'cs2'

export interface LiveMatch {
  id: string
  league: string
  status: 'LIVE' | 'UPCOMING' | 'FINAL'
  startsAt?: string
  teamA: { name: string; short: string; score: number; logoColor: string }
  teamB: { name: string; short: string; score: number; logoColor: string }
  bestOf?: number
  currentGame?: number
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  category: NewsCategory
  categoryLabel: string
  thumbnail: string
  publishedAt: string
  source?: string
  isBreaking?: boolean
}

export interface NewsListResponse {
  items: NewsArticle[]
  page: number
  totalPages: number
}

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

const HERO_THUMB =
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'

const MOCK_LIVE_MATCHES: LiveMatch[] = [
  {
    id: 'm-001',
    league: 'LCK',
    status: 'LIVE',
    teamA: { name: 'T1', short: 'T1', score: 2, logoColor: '#e2231a' },
    teamB: { name: 'Gen.G', short: 'GEN', score: 1, logoColor: '#aa8a3a' },
    bestOf: 5,
    currentGame: 4,
  },
  {
    id: 'm-002',
    league: 'VCT Pacific',
    status: 'LIVE',
    teamA: { name: 'DRX', short: 'DRX', score: 1, logoColor: '#1c4ed8' },
    teamB: { name: 'PRX', short: 'PRX', score: 1, logoColor: '#ff5a36' },
    bestOf: 3,
    currentGame: 3,
  },
  {
    id: 'm-003',
    league: 'BLAST CS2',
    status: 'UPCOMING',
    startsAt: 'Today 21:00',
    teamA: { name: 'NAVI', short: 'NAVI', score: 0, logoColor: '#f7d800' },
    teamB: { name: 'Vitality', short: 'VIT', score: 0, logoColor: '#ffd54a' },
    bestOf: 3,
  },
  {
    id: 'm-004',
    league: 'LPL',
    status: 'LIVE',
    teamA: { name: 'JDG', short: 'JDG', score: 0, logoColor: '#d12c2c' },
    teamB: { name: 'BLG', short: 'BLG', score: 2, logoColor: '#1f8a3a' },
    bestOf: 5,
    currentGame: 3,
  },
  {
    id: 'm-005',
    league: 'VCT Americas',
    status: 'FINAL',
    teamA: { name: 'Sentinels', short: 'SEN', score: 2, logoColor: '#e9b54a' },
    teamB: { name: 'NRG', short: 'NRG', score: 0, logoColor: '#3a4ed8' },
    bestOf: 3,
  },
]

const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'n-1',
    title: 'T1, GEN과의 결승전에서 극적인 역전승… Faker의 또 한 번의 신화',
    summary:
      '5세트 접전 끝에 T1이 Gen.G를 꺾고 LCK 결승 우승을 차지했다. 이번 시즌 최고의 명승부로 꼽힌다.',
    category: 'lol',
    categoryLabel: 'League of Legends',
    thumbnail:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    publishedAt: '5분 전',
    source: 'Inven',
    isBreaking: true,
  },
  {
    id: 'n-2',
    title: 'VALORANT 마스터스: DRX, 신규 로스터로 PRX 압도',
    summary:
      '리빌딩 시즌을 마친 DRX가 결정적 한타에서 압도적 경기력으로 PRX를 제압했다.',
    category: 'valorant',
    categoryLabel: 'Valorant',
    thumbnail:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    publishedAt: '17분 전',
    source: 'Riot',
  },
  {
    id: 'n-3',
    title: 'BLAST Bounty: NAVI 신예 듀얼리스트, 1.45 평점으로 MVP 선정',
    summary:
      '데뷔 시즌부터 압도적인 폼을 보여주는 신예가 BLAST Bounty에서 또다시 MVP에 선정됐다.',
    category: 'cs2',
    categoryLabel: 'CS2',
    thumbnail:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    publishedAt: '42분 전',
    source: 'HLTV',
  },
  {
    id: 'n-4',
    title: 'LCK 스프링, T1 정규시즌 1위 확정… 플레이오프 직행',
    summary:
      'T1이 7연승을 달리며 정규 시즌 1위를 조기 확정지었다. 플레이오프는 4월 첫째 주 개막.',
    category: 'lol',
    categoryLabel: 'League of Legends',
    thumbnail:
      'https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&w=800&q=80',
    publishedAt: '1시간 전',
    source: 'LCK',
  },
  {
    id: 'n-5',
    title: 'VCT Pacific: PRX, 새로운 IGL 영입… 7월 출전 예정',
    summary:
      'Paper Rex가 베테랑 IGL을 영입하며 새 시즌 라인업을 보강했다.',
    category: 'valorant',
    categoryLabel: 'Valorant',
    thumbnail:
      'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2시간 전',
    source: 'PRX',
  },
  {
    id: 'n-6',
    title: 'CS2 메이저: 한국 대표팀, 그룹 스테이지 통과 확정',
    summary:
      '국가대표팀이 첫 메이저 본선 진출을 확정지으며 새로운 역사를 썼다.',
    category: 'cs2',
    categoryLabel: 'CS2',
    thumbnail:
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=800&q=80',
    publishedAt: '3시간 전',
    source: 'Valve',
  },
  {
    id: 'n-7',
    title: 'LoL e스포츠, 2026 글로벌 리그 개편안 공식 발표',
    summary:
      '리그·국제 대회 일정과 시드 배분 규칙이 새롭게 바뀐다. 자세한 내용 정리.',
    category: 'lol',
    categoryLabel: 'League of Legends',
    thumbnail:
      'https://images.unsplash.com/photo-1604079628040-94301bb21b91?auto=format&fit=crop&w=800&q=80',
    publishedAt: '4시간 전',
    source: 'Riot',
  },
  {
    id: 'n-8',
    title: 'Valorant Champions: 패치 7.10 메타 분석',
    summary:
      '신규 패치가 픽률·승률에 어떤 영향을 미치는지 데이터로 살펴본다.',
    category: 'valorant',
    categoryLabel: 'Valorant',
    thumbnail:
      'https://images.unsplash.com/photo-1614294148960-9aa740632a87?auto=format&fit=crop&w=800&q=80',
    publishedAt: '5시간 전',
    source: 'Inven',
  },
  {
    id: 'n-9',
    title: 'CS2 ESL Pro League: FaZe Clan, 결승 진출',
    summary:
      'FaZe가 4강에서 G2를 꺾고 결승 무대에 안착했다.',
    category: 'cs2',
    categoryLabel: 'CS2',
    thumbnail:
      'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80',
    publishedAt: '6시간 전',
    source: 'ESL',
  },
  {
    id: 'n-10',
    title: 'LCK 신인 드래프트: Top 5 유망주 프로필 정리',
    summary:
      '올해 LCK CL에서 가장 주목 받은 다섯 명의 신인을 정리했다.',
    category: 'lol',
    categoryLabel: 'League of Legends',
    thumbnail:
      'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80',
    publishedAt: '7시간 전',
    source: 'OP.GG',
  },
  {
    id: 'n-11',
    title: 'Valorant 한국 챌린저스, 시즌 2 일정 공개',
    summary:
      '시즌 2 본선 일정과 진출권 배분이 공식 발표됐다.',
    category: 'valorant',
    categoryLabel: 'Valorant',
    thumbnail:
      'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
    publishedAt: '8시간 전',
    source: 'Riot Korea',
  },
  {
    id: 'n-12',
    title: 'CS2 PGL: 한국 신생팀, 본선 직행 시드 확보',
    summary:
      '예선전에서 압도적인 폼으로 본선 직행 시드를 따냈다.',
    category: 'cs2',
    categoryLabel: 'CS2',
    thumbnail:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    publishedAt: '9시간 전',
    source: 'PGL',
  },
]

const PAGE_SIZE = 6

function paginateMock(category: NewsCategory, page: number, limit: number): NewsListResponse {
  const filtered = category === 'all' ? MOCK_NEWS : MOCK_NEWS.filter((n) => n.category === category)
  const start = (page - 1) * limit
  const items = filtered.slice(start, start + limit)
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  return { items, page, totalPages }
}

async function safeFetch<T>(url: string): Promise<T | null> {
  if (!API_URL) return null
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function fetchLiveMatches(): Promise<LiveMatch[]> {
  const remote = await safeFetch<LiveMatch[]>(`${API_URL}/api/matches/live`)
  return remote ?? MOCK_LIVE_MATCHES
}

export async function fetchNews(
  category: NewsCategory,
  page: number,
  limit = PAGE_SIZE,
): Promise<NewsListResponse> {
  const params = new URLSearchParams()
  if (category !== 'all') params.set('category', category)
  params.set('page', String(page))
  params.set('limit', String(limit))
  const remote = await safeFetch<NewsListResponse>(`${API_URL}/api/news?${params.toString()}`)
  return remote ?? paginateMock(category, page, limit)
}

export const HERO_BANNER = {
  tag: 'BREAKING NEWS',
  headline: 'T1, GEN과의 결승전에서 극적인 역전승',
  summary:
    'Faker가 이끄는 T1이 5세트 접전 끝에 Gen.G를 제압하며 LCK 우승 트로피를 들어 올렸다.',
  publishedAt: '2분 전',
  thumbnail: HERO_THUMB,
}

export const CATEGORIES: { id: NewsCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'lol', label: 'League of Legends' },
  { id: 'valorant', label: 'Valorant' },
  { id: 'cs2', label: 'CS2' },
]
