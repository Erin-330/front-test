import { useCallback, useEffect, useRef, useState } from 'react'
import { BottomNav, type BottomNavTab } from './components/BottomNav'
import { CategoryFilters } from './components/CategoryFilters'
import { FeaturedNews } from './components/FeaturedNews'
import { LiveScoreSection } from './components/LiveScoreSection'
import { NewsFeed } from './components/NewsFeed'
import { TopNav } from './components/TopNav'
import { fetchMatches, fetchNews, getFeaturedNews } from './api'
import type { GameCategory, Match, NewsItem } from './types'

export function EsportsPage() {
  const [category, setCategory] = useState<GameCategory>('All')
  const [activeTab, setActiveTab] = useState<BottomNavTab>('home')

  const [news, setNews] = useState<NewsItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsError, setNewsError] = useState<string | null>(null)

  const [matches, setMatches] = useState<Match[]>([])
  const [matchesLoading, setMatchesLoading] = useState(true)

  const featured = getFeaturedNews()
  const requestSeq = useRef(0)

  const loadPage = useCallback(
    async (nextPage: number, currentCategory: GameCategory, replace: boolean) => {
      const seq = ++requestSeq.current
      setNewsLoading(true)
      setNewsError(null)
      try {
        const result = await fetchNews({
          page: nextPage,
          gameTitle: currentCategory === 'All' ? undefined : currentCategory,
        })
        if (seq !== requestSeq.current) return
        setNews((prev) => (replace ? result.items : [...prev, ...result.items]))
        setHasMore(result.hasMore)
        setPage(result.page)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        if (seq !== requestSeq.current) return
        setNewsError('Failed to load news. Tap to retry.')
      } finally {
        if (seq === requestSeq.current) setNewsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    loadPage(1, category, true)
  }, [category, loadPage])

  useEffect(() => {
    let cancelled = false
    setMatchesLoading(true)
    fetchMatches({ isLive: true, league: 'LCK' })
      .then((data) => {
        if (cancelled) return
        setMatches(data)
      })
      .finally(() => {
        if (!cancelled) setMatchesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleLoadMore = useCallback(() => {
    if (newsLoading || !hasMore) return
    loadPage(page + 1, category, false)
  }, [category, hasMore, loadPage, newsLoading, page])

  const handleCategoryChange = useCallback((next: GameCategory) => {
    setCategory(next)
    setNews([])
    setPage(1)
    setHasMore(true)
  }, [])

  return (
    <div className="flex min-h-full flex-col bg-azure-background font-hanken text-azure-ink">
      <TopNav unreadCount={3} />
      <main className="flex-1">
        <LiveScoreSection matches={matches} loading={matchesLoading} />
        <FeaturedNews item={featured} />
        <CategoryFilters active={category} onChange={handleCategoryChange} />
        <NewsFeed
          items={news}
          loading={newsLoading}
          hasMore={hasMore}
          error={newsError}
          onLoadMore={handleLoadMore}
        />
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
