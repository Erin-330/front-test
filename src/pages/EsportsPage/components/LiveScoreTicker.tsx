import type { LiveMatch } from '../types'

interface LiveScoreTickerProps {
  matches: LiveMatch[]
  loading: boolean
  error: string | null
  onSelect?: (match: LiveMatch) => void
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-red-500/15 px-1.5 py-[2px] text-[10px] font-bold uppercase tracking-wider text-red-400">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
      LIVE
    </span>
  )
}

function MatchCardSkeleton() {
  return (
    <div className="flex h-[96px] w-[200px] shrink-0 flex-col justify-between rounded-xl border border-azure-border bg-azure-surface p-3">
      <div className="flex items-center justify-between">
        <div className="h-3 w-12 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-8 animate-pulse rounded bg-white/10" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  )
}

export function LiveScoreTicker({ matches, loading, error, onSelect }: LiveScoreTickerProps) {
  return (
    <section className="px-4 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-hanken text-[14px] font-bold uppercase tracking-wider text-azure-ink-muted">
          Live Scores
        </h2>
      </div>

      <div
        className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading && matches.length === 0 ? (
          <>
            <MatchCardSkeleton />
            <MatchCardSkeleton />
            <MatchCardSkeleton />
          </>
        ) : error && matches.length === 0 ? (
          <div className="flex h-[96px] w-full items-center justify-center rounded-xl border border-azure-border bg-azure-surface text-[13px] text-azure-ink-muted">
            {error}
          </div>
        ) : matches.length === 0 ? (
          <div className="flex h-[96px] w-full items-center justify-center rounded-xl border border-azure-border bg-azure-surface text-[13px] text-azure-ink-muted">
            No live matches right now
          </div>
        ) : (
          matches.map((m) => (
            <button
              key={String(m.id)}
              type="button"
              onClick={() => onSelect?.(m)}
              className="group flex h-[96px] w-[200px] shrink-0 flex-col justify-between rounded-xl border border-azure-border bg-azure-surface p-3 text-left transition-all hover:border-azure-trust hover:bg-azure-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-trust"
            >
              <div className="flex items-center justify-between">
                <span className="font-hanken text-[11px] font-bold uppercase tracking-wider text-azure-ink-muted">
                  {m.league}
                </span>
                {m.isLive && <LiveBadge />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-hanken text-[13px] font-semibold text-white">
                    {m.teamAName}
                  </span>
                  <span className="font-hanken text-[14px] font-bold text-white tabular-nums">
                    {m.teamAScore}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-hanken text-[13px] font-semibold text-white">
                    {m.teamBName}
                  </span>
                  <span className="font-hanken text-[14px] font-bold text-white tabular-nums">
                    {m.teamBScore}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  )
}
