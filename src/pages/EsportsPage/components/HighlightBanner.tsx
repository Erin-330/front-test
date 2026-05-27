import type { NewsItem } from '../types'

interface HighlightBannerProps {
  item: NewsItem | null
  loading: boolean
  onSelect?: (item: NewsItem) => void
}

export function HighlightBanner({ item, loading, onSelect }: HighlightBannerProps) {
  if (loading && !item) {
    return (
      <section className="px-4 pt-6">
        <div className="relative h-[200px] w-full animate-pulse overflow-hidden rounded-2xl bg-azure-surface" />
      </section>
    )
  }

  if (!item) return null

  return (
    <section className="px-4 pt-6">
      <button
        type="button"
        onClick={() => onSelect?.(item)}
        className="group relative block h-[200px] w-full overflow-hidden rounded-2xl bg-azure-surface text-left transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-trust"
      >
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-azure-trust to-azure-bg" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-red-600 px-2 py-1 font-hanken text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg">
          Breaking News
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-hanken text-[18px] font-bold leading-tight text-white line-clamp-2">
            {item.title}
          </h3>
          {item.summary && (
            <p className="mt-1 font-hanken text-[13px] font-normal leading-snug text-white/80 line-clamp-2">
              {item.summary}
            </p>
          )}
        </div>
      </button>
    </section>
  )
}
