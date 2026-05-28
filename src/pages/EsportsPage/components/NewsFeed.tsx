import { useEffect, useRef } from 'react'
import type { NewsItem } from '../types'
import { NewsCard } from './NewsCard'

interface NewsFeedProps {
  items: NewsItem[]
  loading: boolean
  hasMore: boolean
  error?: string | null
  onLoadMore: () => void
  onItemClick?: (item: NewsItem) => void
}

function NewsSkeleton() {
  return (
    <div className="flex animate-pulse gap-3 rounded-lg border border-azure-border bg-white p-3">
      <div className="h-[88px] w-[88px] shrink-0 rounded-lg bg-azure-background" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3 w-20 rounded bg-azure-background" />
        <div className="h-4 rounded bg-azure-background" />
        <div className="h-4 w-3/4 rounded bg-azure-background" />
        <div className="mt-auto h-3 w-1/2 rounded bg-azure-background" />
      </div>
    </div>
  )
}

export function NewsFeed({
  items,
  loading,
  hasMore,
  error,
  onLoadMore,
  onItemClick,
}: NewsFeedProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    if (!hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin: '320px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  return (
    <section aria-label="Latest news" className="px-4 pb-8 pt-4">
      <h2 className="mb-3 font-hanken text-[16px] font-bold text-azure-ink">Latest News</h2>
      <ul role="list" className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <NewsCard item={item} onClick={onItemClick} />
          </li>
        ))}
        {loading &&
          Array.from({ length: items.length === 0 ? 5 : 2 }).map((_, idx) => (
            <li key={`skeleton-${idx}`}>
              <NewsSkeleton />
            </li>
          ))}
      </ul>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-[13px] font-medium text-red-700">
          {error}
          <button
            type="button"
            onClick={onLoadMore}
            className="ml-2 font-semibold underline focus:outline-none"
          >
            Retry
          </button>
        </div>
      )}

      {hasMore && !error && <div ref={sentinelRef} aria-hidden className="h-1" />}

      {!hasMore && items.length > 0 && (
        <p className="mt-6 text-center text-[12px] font-medium text-azure-muted">
          You're all caught up.
        </p>
      )}
    </section>
  )
}
