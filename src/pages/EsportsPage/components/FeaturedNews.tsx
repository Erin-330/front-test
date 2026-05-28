import type { NewsItem } from '../types'
import { formatTimeAgo } from '../utils'

interface FeaturedNewsProps {
  item: NewsItem
  onClick?: (item: NewsItem) => void
}

export function FeaturedNews({ item, onClick }: FeaturedNewsProps) {
  return (
    <section aria-label="Featured story" className="px-4 pt-4">
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
        className="group relative block overflow-hidden rounded-lg bg-azure-ink shadow-[0_4px_14px_rgba(15,23,42,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-primary"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={item.thumbnail}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/0" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 text-white">
          <span className="inline-flex w-fit items-center gap-1 rounded-md bg-azure-primary px-2 py-1 text-[11px] font-bold uppercase tracking-wide">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
            Featured · {item.category}
          </span>
          <h3 className="font-hanken text-[20px] font-bold leading-tight">{item.title}</h3>
          <p className="text-[12px] font-medium text-white/80">
            {item.source} · {formatTimeAgo(item.publishedAt)}
          </p>
        </div>
      </article>
    </section>
  )
}
