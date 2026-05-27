import { useEffect, useRef } from 'react'
import type { NewsItem } from '../types'
import { categoryBadgeClasses, formatTimeAgo } from '../utils'

interface NewsListProps {
  items: NewsItem[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  error: string | null
  onLoadMore: () => void
  onSelect?: (item: NewsItem) => void
}

function NewsCardSkeleton() {
  return (
    <article className="flex gap-3 rounded-xl border border-azure-border bg-azure-surface p-3">
      <div className="h-[88px] w-[88px] shrink-0 animate-pulse rounded-lg bg-white/10" />
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-full animate-pulse rounded bg-white/10" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
        </div>
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
      </div>
    </article>
  )
}

export function NewsList({
  items,
  loading,
  loadingMore,
  hasMore,
  error,
  onLoadMore,
  onSelect,
}: NewsListProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    if (!hasMore || loading || loadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loading, loadingMore, onLoadMore])

  const isInitialLoading = loading && items.length === 0

  return (
    <section className="px-4 pb-24 pt-4">
      <h2 className="mb-3 font-hanken text-[14px] font-bold uppercase tracking-wider text-azure-ink-muted">
        Latest News
      </h2>

      {error && items.length === 0 ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-[13px] text-red-300">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {isInitialLoading ? (
          <>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </>
        ) : items.length === 0 && !error ? (
          <div className="rounded-xl border border-azure-border bg-azure-surface p-6 text-center text-[13px] text-azure-ink-muted">
            No news in this category yet.
          </div>
        ) : (
          items.map((n) => (
            <button
              key={String(n.id)}
              type="button"
              onClick={() => onSelect?.(n)}
              className="group flex gap-3 rounded-xl border border-azure-border bg-azure-surface p-3 text-left transition-all hover:border-azure-trust hover:bg-azure-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-trust"
            >
              <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-lg bg-azure-surface-2">
                {n.thumbnailUrl ? (
                  <img
                    src={n.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-azure-trust/40 to-azure-surface" />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between py-[2px]">
                <div className="space-y-1.5">
                  <span
                    className={[
                      'inline-flex items-center rounded-md px-2 py-[2px] font-hanken text-[10px] font-bold uppercase tracking-wider',
                      categoryBadgeClasses(n.category),
                    ].join(' ')}
                  >
                    {String(n.category).toUpperCase()}
                  </span>
                  <h3 className="font-hanken text-[15px] font-semibold leading-snug text-white line-clamp-2">
                    {n.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 font-hanken text-[11px] text-azure-ink-muted">
                  <span>{formatTimeAgo(n.publishedAt)}</span>
                  <span aria-hidden>•</span>
                  <span className="truncate">{n.source}</span>
                </div>
              </div>
            </button>
          ))
        )}

        {loadingMore && (
          <>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </>
        )}

        {!hasMore && items.length > 0 && (
          <p className="py-4 text-center font-hanken text-[12px] text-azure-ink-muted">
            You're all caught up
          </p>
        )}

        <div ref={sentinelRef} aria-hidden className="h-1 w-full" />
      </div>
    </section>
  )
}
