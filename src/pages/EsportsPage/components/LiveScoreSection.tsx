import type { Match } from '../types'

interface LiveScoreSectionProps {
  matches: Match[]
  loading?: boolean
}

function TeamLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-8 w-8 rounded-full bg-azure-background object-contain p-1"
      onError={(e) => {
        ;(e.target as HTMLImageElement).style.visibility = 'hidden'
      }}
    />
  )
}

function MatchCard({ match }: { match: Match }) {
  const aWin = match.teamA.score > match.teamB.score
  const bWin = match.teamB.score > match.teamA.score
  return (
    <article
      role="button"
      tabIndex={0}
      className="flex min-w-[228px] snap-start flex-col gap-3 rounded-lg border border-azure-border bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_4px_12px_rgba(15,23,42,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-primary"
    >
      <header className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-azure-background px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-azure-primary">
          <img
            src={match.leagueBadge}
            alt=""
            aria-hidden
            className="h-3.5 w-3.5 object-contain"
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
          />
          {match.league}
        </span>
        {match.isLive && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-azure-live">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-azure-live opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-azure-live" />
            </span>
            Live
          </span>
        )}
      </header>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <TeamLogo src={match.teamA.logo} alt={match.teamA.name} />
            <span
              className={`truncate font-hanken text-[13px] ${
                aWin ? 'font-bold text-azure-ink' : 'font-medium text-azure-ink/80'
              }`}
            >
              {match.teamA.shortName}
            </span>
          </div>
          <span
            className={`font-hanken text-[16px] tabular-nums ${
              aWin ? 'font-bold text-azure-primary' : 'font-semibold text-azure-ink/80'
            }`}
          >
            {match.teamA.score}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <TeamLogo src={match.teamB.logo} alt={match.teamB.name} />
            <span
              className={`truncate font-hanken text-[13px] ${
                bWin ? 'font-bold text-azure-ink' : 'font-medium text-azure-ink/80'
              }`}
            >
              {match.teamB.shortName}
            </span>
          </div>
          <span
            className={`font-hanken text-[16px] tabular-nums ${
              bWin ? 'font-bold text-azure-primary' : 'font-semibold text-azure-ink/80'
            }`}
          >
            {match.teamB.score}
          </span>
        </div>
      </div>

      <footer className="text-[11px] font-medium text-azure-muted">{match.status}</footer>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className="min-w-[228px] animate-pulse rounded-lg border border-azure-border bg-white p-3">
      <div className="mb-3 h-4 w-16 rounded bg-azure-background" />
      <div className="space-y-2">
        <div className="h-4 rounded bg-azure-background" />
        <div className="h-4 rounded bg-azure-background" />
      </div>
    </div>
  )
}

export function LiveScoreSection({ matches, loading }: LiveScoreSectionProps) {
  return (
    <section aria-label="Live scores" className="bg-white pb-2">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h2 className="font-hanken text-[16px] font-bold text-azure-ink">Live Scores</h2>
        <button
          type="button"
          className="text-[12px] font-semibold text-azure-primary hover:text-azure-primaryDark focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-primary"
        >
          See all
        </button>
      </div>
      <div
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {loading && matches.length === 0 ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : matches.length === 0 ? (
          <div className="flex h-[112px] w-full items-center justify-center text-[13px] text-azure-muted">
            No live matches right now.
          </div>
        ) : (
          matches.map((m) => (
            <div role="listitem" key={m.id}>
              <MatchCard match={m} />
            </div>
          ))
        )}
      </div>
    </section>
  )
}
