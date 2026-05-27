import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchLiveMatches,
  fetchNews,
  type LiveMatch,
  type NewsArticle,
  type NewsCategory,
} from './api'

export function useLiveMatches() {
  const [matches, setMatches] = useState<LiveMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchLiveMatches()
      .then((data) => {
        if (cancelled) return
        setMatches(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'failed to load matches')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { matches, loading, error }
}

interface NewsFeedState {
  items: NewsArticle[]
  page: number
  totalPages: number
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  error: string | null
}

const INITIAL: NewsFeedState = {
  items: [],
  page: 0,
  totalPages: 1,
  loading: true,
  loadingMore: false,
  hasMore: true,
  error: null,
}

export function useNewsFeed(category: NewsCategory) {
  const [state, setState] = useState<NewsFeedState>(INITIAL)
  const requestRef = useRef(0)

  useEffect(() => {
    const reqId = ++requestRef.current
    setState({ ...INITIAL })
    fetchNews(category, 1)
      .then((data) => {
        if (reqId !== requestRef.current) return
        setState({
          items: data.items,
          page: data.page,
          totalPages: data.totalPages,
          loading: false,
          loadingMore: false,
          hasMore: data.page < data.totalPages,
          error: null,
        })
      })
      .catch((err: unknown) => {
        if (reqId !== requestRef.current) return
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'failed to load news',
        }))
      })
  }, [category])

  const loadMore = useCallback(() => {
    setState((prev) => {
      if (prev.loading || prev.loadingMore || !prev.hasMore) return prev
      const nextPage = prev.page + 1
      const reqId = ++requestRef.current
      fetchNews(category, nextPage)
        .then((data) => {
          if (reqId !== requestRef.current) return
          setState((cur) => ({
            ...cur,
            items: [...cur.items, ...data.items],
            page: data.page,
            totalPages: data.totalPages,
            loadingMore: false,
            hasMore: data.page < data.totalPages,
          }))
        })
        .catch((err: unknown) => {
          if (reqId !== requestRef.current) return
          setState((cur) => ({
            ...cur,
            loadingMore: false,
            error: err instanceof Error ? err.message : 'failed to load more news',
          }))
        })
      return { ...prev, loadingMore: true }
    })
  }, [category])

  return useMemo(() => ({ ...state, loadMore }), [state, loadMore])
}

export function useInfiniteScroll(
  onLoadMore: () => void,
  enabled: boolean,
): (node: HTMLElement | null) => void {
  const observer = useRef<IntersectionObserver | null>(null)

  return useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect()
      if (!enabled || !node) return
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) onLoadMore()
        },
        { rootMargin: '160px' },
      )
      observer.current.observe(node)
    },
    [enabled, onLoadMore],
  )
}
