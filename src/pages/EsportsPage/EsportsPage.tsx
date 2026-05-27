import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TopAppBar } from './components/TopAppBar'
import { LiveScoreTicker } from './components/LiveScoreTicker'
import { HighlightBanner } from './components/HighlightBanner'
import { CategoryTabs, CATEGORY_OPTIONS } from './components/CategoryTabs'
import { NewsList } from './components/NewsList'
import { BottomNavigation } from './components/BottomNavigation'
import type { BottomTab } from './components/BottomNavigation'
import type { FeedCategory, LiveMatch, NewsItem } from './types'
import { fetchLiveMatches, fetchNews } from './api'

interface EsportsPageProps {
  onNavigate?: (path: string) => void
}

interface Toast {
  id: number
  message: string
}

const PAGE_LIMIT = 20

export function EsportsPage({ onNavigate }: EsportsPageProps) {
  const [matches, setMatches] = useState<LiveMatch[]>([])
  const [matchesLoading, setMatchesLoading] = useState(true)
  const [matchesError, setMatchesError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<FeedCategory>('all')
  const [news, setNews] = useState<NewsItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsLoadingMore, setNewsLoadingMore] = useState(false)
  const [newsError, setNewsError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<BottomTab>('home')
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)

  const pushToast = useCallback((message: string) => {
    const id = ++toastIdRef.current
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3200)
  }, [])

  // Load live matches once on mount.
  useEffect(() => {
    const controller = new AbortController()
    setMatchesLoading(true)
    setMatchesError(null)
    fetchLiveMatches(controller.signal)
      .then((res) => {
        setMatches(res.data ?? [])
      })
      .catch((err: unknown) => {
        if ((err as DOMException)?.name === 'AbortError') return
        const msg = err instanceof Error ? err.message : 'Unable to load live matches'
        setMatchesError(msg)
        pushToast(msg)
      })
      .finally(() => setMatchesLoading(false))
    return () => controller.abort()
  }, [pushToast])

  const apiCategoryParam = useMemo(() => {
    const opt = CATEGORY_OPTIONS.find((o) => o.id === selectedCategory)
    return opt?.apiParam ?? 'all'
  }, [selectedCategory])

  // Reload news whenever the category changes.
  useEffect(() => {
    const controller = new AbortController()
    setNews([])
    setPage(1)
    setHasMore(true)
    setNewsLoading(true)
    setNewsError(null)
    fetchNews(
      { category: apiCategoryParam, page: 1, limit: PAGE_LIMIT },
      controller.signal,
    )
      .then((res) => {
        const data = res.data ?? []
        setNews(data)
        const total = res.meta?.total ?? data.length
        setHasMore(data.length === PAGE_LIMIT && 1 * PAGE_LIMIT < total)
      })
      .catch((err: unknown) => {
        if ((err as DOMException)?.name === 'AbortError') return
        const msg = err instanceof Error ? err.message : 'Unable to load news'
        setNewsError(msg)
        setHasMore(false)
        pushToast(msg)
      })
      .finally(() => setNewsLoading(false))
    return () => controller.abort()
  }, [apiCategoryParam, pushToast])

  const handleLoadMore = useCallback(() => {
    if (newsLoadingMore || newsLoading || !hasMore) return
    const nextPage = page + 1
    setNewsLoadingMore(true)
    fetchNews({ category: apiCategoryParam, page: nextPage, limit: PAGE_LIMIT })
      .then((res) => {
        const data = res.data ?? []
        setNews((prev) => {
          const seen = new Set(prev.map((p) => String(p.id)))
          const merged = [...prev]
          for (const item of data) {
            if (!seen.has(String(item.id))) merged.push(item)
          }
          const total = res.meta?.total ?? merged.length
          setHasMore(data.length === PAGE_LIMIT && merged.length < total)
          return merged
        })
        setPage(nextPage)
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Unable to load more news'
        pushToast(msg)
        setHasMore(false)
      })
      .finally(() => setNewsLoadingMore(false))
  }, [apiCategoryParam, hasMore, newsLoading, newsLoadingMore, page, pushToast])

  const banner = news[0] ?? null
  const listItems = news.length > 1 ? news.slice(1) : []

  const navigate = useCallback(
    (path: string) => {
      if (onNavigate) onNavigate(path)
      else if (typeof window !== 'undefined') window.location.hash = path
    },
    [onNavigate],
  )

  const handleMatchSelect = useCallback(
    (match: LiveMatch) => {
      navigate(`/matches/${match.id}`)
    },
    [navigate],
  )

  const handleNewsSelect = useCallback(
    (item: NewsItem) => {
      navigate(`/news/${item.id}`)
    },
    [navigate],
  )

  const handleTabChange = useCallback(
    (tab: BottomTab) => {
      setActiveTab(tab)
      if (tab === 'home') return
      if (tab === 'news') navigate('/news')
      else if (tab === 'matches') navigate('/matches')
      else if (tab === 'profile') navigate('/profile')
    },
    [navigate],
  )

  return (
    <div className="min-h-screen bg-azure-bg font-hanken text-azure-ink">
      <div className="mx-auto flex min-h-screen max-w-[780px] flex-col">
        <TopAppBar
          onMenu={() => pushToast('Menu coming soon')}
          onSearch={() => pushToast('Search coming soon')}
          onNotifications={() => pushToast('No new notifications')}
        />

        <LiveScoreTicker
          matches={matches}
          loading={matchesLoading}
          error={matchesError}
          onSelect={handleMatchSelect}
        />

        <HighlightBanner
          item={banner}
          loading={newsLoading}
          onSelect={handleNewsSelect}
        />

        <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />

        <NewsList
          items={listItems}
          loading={newsLoading}
          loadingMore={newsLoadingMore}
          hasMore={hasMore}
          error={newsError}
          onLoadMore={handleLoadMore}
          onSelect={handleNewsSelect}
        />

        <BottomNavigation active={activeTab} onChange={handleTabChange} />
      </div>

      {toasts.length > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex flex-col items-center gap-2 px-4">
          {toasts.map((t) => (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto max-w-[420px] rounded-lg border border-azure-border bg-azure-surface px-4 py-2 text-[13px] text-white shadow-lg"
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
