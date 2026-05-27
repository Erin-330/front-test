import type { NewsArticle } from '../api'

interface NewsListProps {
  items: NewsArticle[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  sentinelRef: (node: HTMLElement | null) => void
  error: string | null
  emptyMessage: string
  onSelect: (id: string) => void
}

export function NewsList({
  items,
  loading,
  loadingMore,
  hasMore,
  sentinelRef,
  error,
  emptyMessage,
  onSelect,
}: NewsListProps) {
  if (loading) {
    return (
      <ul className="flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="flex animate-pulse gap-3 rounded-2xl border border-azure-border bg-white p-3"
          >
            <div className="h-[88px] w-[112px] flex-shrink-0 rounded-xl bg-azure-surface" />
            <div className="flex flex-1 flex-col gap-2 py-1">
              <div className="h-3 w-16 rounded bg-azure-surface" />
              <div className="h-4 w-full rounded bg-azure-surface" />
              <div className="h-4 w-4/5 rounded bg-azure-surface" />
              <div className="mt-auto h-3 w-12 rounded bg-azure-surface" />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (error && items.length === 0) {
    return (
      <p className="rounded-xl bg-azure-50 px-4 py-6 text-center text-[13px] text-azure-muted">
        뉴스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    )
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl bg-azure-surface px-4 py-6 text-center text-[13px] text-azure-muted">
        {emptyMessage}
      </p>
    )
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {items.map((article) => (
          <li key={article.id}>
            <NewsCard article={article} onSelect={() => onSelect(article.id)} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-5 text-[12px] text-azure-muted"
        >
          {loadingMore ? '뉴스를 더 불러오는 중…' : '스크롤하여 더 보기'}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p className="py-5 text-center text-[12px] text-azure-muted">
          모든 뉴스를 확인했습니다.
        </p>
      )}
    </>
  )
}

function NewsCard({
  article,
  onSelect,
}: {
  article: NewsArticle
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full gap-3 rounded-2xl border border-azure-border bg-white p-3 text-left transition-shadow hover:shadow-[0_6px_18px_rgba(0,61,155,0.08)]"
    >
      <div className="relative h-[88px] w-[112px] flex-shrink-0 overflow-hidden rounded-xl bg-azure-surface">
        <img
          src={article.thumbnail}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-md bg-azure-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-azure-600">
            {article.categoryLabel}
          </span>
          {article.isBreaking && (
            <span className="inline-flex items-center rounded-md bg-azure-live/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-azure-live">
              HOT
            </span>
          )}
        </div>
        <h3 className="mt-1.5 font-display text-[14px] font-bold leading-snug tracking-tight text-azure-ink line-clamp-2">
          {article.title}
        </h3>
        <div className="mt-auto flex items-center gap-2 pt-1.5 text-[11px] text-azure-muted">
          {article.source && <span className="font-semibold">{article.source}</span>}
          {article.source && <span aria-hidden>·</span>}
          <span>{article.publishedAt}</span>
        </div>
      </div>
    </button>
  )
}
