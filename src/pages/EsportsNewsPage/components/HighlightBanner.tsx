interface HighlightBannerProps {
  banner: {
    tag: string
    headline: string
    summary: string
    publishedAt: string
    thumbnail: string
  }
  onClick: () => void
}

export function HighlightBanner({ banner, onClick }: HighlightBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full overflow-hidden rounded-2xl border border-azure-border bg-azure-ink text-left shadow-[0_10px_30px_rgba(0,32,90,0.18)] transition-transform hover:-translate-y-0.5"
    >
      <div className="relative h-[200px] w-full overflow-hidden">
        <img
          src={banner.thumbnail}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001844]/95 via-[#003d9b]/45 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-azure-live px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-md">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />
          {banner.tag}
        </span>
      </div>

      <div className="-mt-16 px-4 pb-4 text-white">
        <h3 className="font-display text-[18px] font-extrabold leading-snug tracking-tight">
          {banner.headline}
        </h3>
        <p className="mt-2 text-[13px] font-light leading-relaxed text-white/85 line-clamp-2">
          {banner.summary}
        </p>
        <span className="mt-3 inline-block text-[11px] font-medium uppercase tracking-wider text-white/60">
          {banner.publishedAt}
        </span>
      </div>
    </button>
  )
}
