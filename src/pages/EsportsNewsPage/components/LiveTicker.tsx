import type { LiveMatch } from '../api'

interface LiveTickerProps {
  matches: LiveMatch[]
  loading: boolean
  onSelect: (matchId: string) => void
}

export function LiveTicker({ matches, loading, onSelect }: LiveTickerProps) {
  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto px-4 pb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[112px] w-[244px] flex-shrink-0 animate-pulse rounded-2xl bg-azure-surface"
          />
        ))}
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <p className="px-4 pb-4 text-[13px] text-azure-muted">
        진행 중인 경기가 없습니다.
      </p>
    )
  }

  return (
    <div
      className="flex gap-3 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="list"
      aria-label="라이브 스코어"
    >
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} onSelect={() => onSelect(match.id)} />
      ))}
    </div>
  )
}

function MatchCard({ match, onSelect }: { match: LiveMatch; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex w-[244px] flex-shrink-0 flex-col rounded-2xl border border-azure-border bg-white p-3 text-left shadow-[0_4px_14px_rgba(0,32,90,0.05)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,61,155,0.12)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-azure-muted">
          {match.league}
        </span>
        <StatusBadge match={match} />
      </div>

      <div className="mt-2.5 flex flex-col gap-1.5">
        <TeamRow team={match.teamA} highlight={match.teamA.score > match.teamB.score} />
        <TeamRow team={match.teamB} highlight={match.teamB.score > match.teamA.score} />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-azure-muted">
        <span>
          {match.bestOf ? `BO${match.bestOf}` : ''}
          {match.currentGame ? ` · Game ${match.currentGame}` : ''}
        </span>
        {match.startsAt && <span>{match.startsAt}</span>}
      </div>
    </button>
  )
}

function StatusBadge({ match }: { match: LiveMatch }) {
  if (match.status === 'LIVE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-azure-live px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white" />
        LIVE
      </span>
    )
  }
  if (match.status === 'UPCOMING') {
    return (
      <span className="inline-flex items-center rounded-full bg-azure-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-azure-600">
        UPCOMING
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-azure-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-azure-muted">
      FINAL
    </span>
  )
}

function TeamRow({
  team,
  highlight,
}: {
  team: LiveMatch['teamA']
  highlight: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: team.logoColor }}
          aria-hidden
        >
          {team.short.slice(0, 3)}
        </span>
        <span
          className={`text-[13px] ${
            highlight ? 'font-bold text-azure-ink' : 'font-medium text-azure-ink/80'
          }`}
        >
          {team.name}
        </span>
      </div>
      <span
        className={`text-[15px] tabular-nums ${
          highlight ? 'font-extrabold text-azure-600' : 'font-semibold text-azure-ink/70'
        }`}
      >
        {team.score}
      </span>
    </div>
  )
}
