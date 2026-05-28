import type { Match, NewsItem } from './types'

const NEWS_THUMBS = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&q=70&auto=format&fit=crop',
]

const CATEGORIES = ['League of Legends', 'Valorant', 'CS2']
const SOURCES = ['ESPN Esports', 'Inven', 'Dot Esports', 'HLTV', 'theScore']

const HEADLINES = [
  'T1 secures playoff spot with dominant 2-0 sweep over Gen.G',
  'Sentinels lock in new flex player ahead of VCT Masters',
  'NaVi snap CS2 cold streak in Major qualifier',
  'Faker breaks all-time MVP record after stunning Worlds run',
  'Riot announces new tournament format for 2026 season',
  'Drx upset reigning champions in opening week',
  'Valorant Champions Tour adds two new partner teams',
  'CS2 patch shakes up the competitive meta — analysts react',
  'Hanwha Life Esports unveils new starting roster',
  'Cloud9 makes shock coaching change days before playoffs',
  'EDward Gaming sign rising mid laner from challenger circuit',
  'Astralis return to form with statement win at IEM',
]

export function generateMockNews(page: number, limit: number, gameTitle?: string): NewsItem[] {
  const items: NewsItem[] = []
  const start = (page - 1) * limit
  for (let i = 0; i < limit; i += 1) {
    const idx = start + i
    const category = gameTitle && gameTitle !== 'All'
      ? gameTitle
      : CATEGORIES[idx % CATEGORIES.length]
    items.push({
      id: `news-${idx}-${Date.now()}`,
      title: HEADLINES[idx % HEADLINES.length],
      category,
      source: SOURCES[idx % SOURCES.length],
      thumbnail: NEWS_THUMBS[idx % NEWS_THUMBS.length],
      publishedAt: new Date(Date.now() - idx * 1000 * 60 * 42).toISOString(),
    })
  }
  return items
}

export const FEATURED_NEWS: NewsItem = {
  id: 'featured-1',
  title: 'Worlds 2026: Inside T1’s historic run to back-to-back finals',
  category: 'League of Legends',
  source: 'ESPN Esports',
  thumbnail:
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80&auto=format&fit=crop',
  publishedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  isFeatured: true,
}

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    league: 'LCK',
    leagueBadge: '/figma/lck.svg',
    isLive: true,
    status: 'Game 3 • Live',
    teamA: {
      name: 'T1',
      shortName: 'T1',
      logo: '/figma/t1Logo.svg',
      score: 2,
    },
    teamB: {
      name: 'Gen.G',
      shortName: 'GEN',
      logo: '/figma/gengLogo.svg',
      score: 1,
    },
  },
  {
    id: 'm2',
    league: 'LCK',
    leagueBadge: '/figma/lck.svg',
    isLive: true,
    status: 'Game 2 • Live',
    teamA: {
      name: 'KT Rolster',
      shortName: 'KT',
      logo: '/figma/ktRolster.svg',
      score: 1,
    },
    teamB: {
      name: 'Hanwha Life',
      shortName: 'HLE',
      logo: '/figma/gengLogo.svg',
      score: 1,
    },
  },
  {
    id: 'm3',
    league: 'LEC',
    leagueBadge: '/figma/lec.png',
    isLive: true,
    status: 'Game 1 • Live',
    teamA: {
      name: 'G2 Esports',
      shortName: 'G2',
      logo: '/figma/t1Logo.svg',
      score: 0,
    },
    teamB: {
      name: 'Fnatic',
      shortName: 'FNC',
      logo: '/figma/gengLogo.svg',
      score: 0,
    },
  },
  {
    id: 'm4',
    league: 'LPL',
    leagueBadge: '/figma/lpl.svg',
    isLive: true,
    status: 'Game 4 • Live',
    teamA: {
      name: 'JD Gaming',
      shortName: 'JDG',
      logo: '/figma/ktRolster.svg',
      score: 2,
    },
    teamB: {
      name: 'BLG',
      shortName: 'BLG',
      logo: '/figma/t1Logo.svg',
      score: 2,
    },
  },
]
