import type { NewsItem } from '../types'
import { formatTimeAgo } from '../utils'

interface NewsCardProps {
  item: NewsItem
  onClick?: (item: NewsItem) => void
}

export function NewsCard({ item, onClick }: NewsCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(item)
        }
      }}
      className="flex gap-3 rounded-lg border border-azure-border bg-white p-3 transition-shadow hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-primary"
    >
      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-lg bg-azure-background">
        <img
          src={item.thumbnail}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0')}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="font-hanken text-[11px] font-bold uppercase tracking-wide text-azure-primary">
            {item.category}
          </span>
          <h4 className="line-clamp-2 font-hanken text-[14px] font-semibold leading-snug text-azure-ink">
            {item.title}
          </h4>
        </div>
        <div className="flex items-center justify-between text-[11px] font-medium text-azure-muted">
          <span className="truncate">{item.source}</span>
          <span className="shrink-0">{formatTimeAgo(item.publishedAt)}</span>
        </div>
      </div>
    </article>
  )
}
