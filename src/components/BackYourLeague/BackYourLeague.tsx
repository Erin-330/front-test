import { useState } from 'react'

const assets = {
  rorrLogoStroke: '/figma/rorrLogoStroke.svg',
  rorrLogoFill: '/figma/rorrLogoFill.svg',
  closeIcon: '/figma/close.svg',
  searchIcon: '/figma/search.svg',
  headerButtonShape: '/figma/headerButtonShape.svg',
  addUserIcon: '/figma/selectArrow.svg',
  lightning: '/figma/lightning.svg',
  arrowRight: '/figma/vector1177Stroke.svg',
  checkmark: '/figma/checkmark.svg',
  lck: '/figma/lck.svg',
  lpl: '/figma/lpl.svg',
  vcs: '/figma/vcs.png',
  msi: '/figma/msi.png',
  lec: '/figma/lec.png',
  cblol: '/figma/cblol.png',
  lla: '/figma/lla.png',
}

type League = {
  id: string
  name: string
  description: string
  logo: string
  logoFit: 'contain' | 'cover'
  hasBoost?: boolean
}

const leagues: League[] = [
  { id: 'lck', name: 'LCK', description: 'League of Legends Champions Korea', logo: assets.lck, logoFit: 'contain', hasBoost: true },
  { id: 'lpl', name: 'LPL', description: 'League of Legends Pro League', logo: assets.lpl, logoFit: 'contain', hasBoost: true },
  { id: 'vcs', name: 'VCS', description: 'Vietnam Championship Series', logo: assets.vcs, logoFit: 'cover', hasBoost: true },
  { id: 'msi', name: 'MSI', description: 'Mid-Season Invitational', logo: assets.msi, logoFit: 'cover', hasBoost: true },
  { id: 'lec', name: 'LEC', description: 'League of Legends EMEA Championship', logo: assets.lec, logoFit: 'cover' },
  { id: 'cblol', name: 'CBLOL', description: 'Circuit Brazilian League of Legends', logo: assets.cblol, logoFit: 'cover' },
  { id: 'lla1', name: 'LEC', description: 'League of Legends in Hispanic America', logo: assets.lla, logoFit: 'cover' },
  { id: 'lla2', name: 'LEC', description: 'League of Legends in Hispanic America', logo: assets.lla, logoFit: 'cover' },
  { id: 'lla3', name: 'LEC', description: 'League of Legends in Hispanic America', logo: assets.lla, logoFit: 'cover' },
  { id: 'lla4', name: 'LEC', description: 'League of Legends in Hispanic America', logo: assets.lla, logoFit: 'cover', hasBoost: true },
]

function BoostTag() {
  return (
    <div className="bg-gradient-to-b from-[#c0b1ff] via-[#a28cff] via-[4.808%] to-[#6f4cff] flex gap-[2px] items-center justify-center overflow-clip px-[2px] py-px rounded-[2px]">
      <div className="overflow-clip relative size-[6px]">
        <img src={assets.lightning} alt="" className="absolute inset-0 size-full" />
      </div>
      <p className="font-bold text-[8px] text-white leading-none">BOOST</p>
    </div>
  )
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Add"
      onClick={onClick}
      className="flex h-full items-center justify-center px-[12px] shrink-0 cursor-pointer"
    >
      <div className="border-[#969cda] border-[0.4px] rounded-[6px] size-[32px] flex items-center justify-center overflow-hidden">
        <img src={assets.addUserIcon} alt="" className="size-[20px]" />
      </div>
    </button>
  )
}

function SelectedNum({ num, onClick }: { num: number; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={`Selected ${num}`}
      onClick={onClick}
      className="bg-[#209fee] flex h-full gap-[4px] items-center justify-center overflow-hidden px-[12px] shrink-0 w-[54px] cursor-pointer"
    >
      <img src={assets.checkmark} alt="" className="w-[13px] h-[9px]" />
      <p className="font-light text-[14px] text-white leading-[20px]">
        {String(num).padStart(2, '0')}
      </p>
    </button>
  )
}

function LeagueCard({
  league,
  selectedIndex,
  onToggle,
}: {
  league: League
  selectedIndex: number
  onToggle: () => void
}) {
  const isSelected = selectedIndex > 0
  return (
    <div
      className={`bg-white flex gap-[4px] h-[68px] items-center rounded-[8px] shrink-0 w-full overflow-hidden shadow-[0px_2px_2px_rgba(0,0,0,0.08)] ${
        isSelected ? 'border-2 border-[#209fee]' : ''
      }`}
    >
      <div className="flex flex-1 gap-[12px] h-full items-center min-w-0 px-[12px]">
        <div className="flex items-center p-[2px] rounded-[6px] shrink-0">
          <div className={`relative shrink-0 size-[28px] ${league.logoFit === 'cover' ? 'overflow-hidden' : ''}`}>
            <img
              src={league.logo}
              alt={league.name}
              className={`absolute inset-0 size-full ${league.logoFit === 'cover' ? 'object-cover' : 'object-contain'}`}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-[4px] items-start justify-center min-w-0">
          {league.hasBoost && <BoostTag />}
          <p className="font-bold leading-none text-[20px] text-black overflow-hidden text-ellipsis whitespace-nowrap min-w-full">
            {league.name}
          </p>
          <p className="font-normal leading-[1.2] text-[#757b90] text-[12px] overflow-hidden text-ellipsis whitespace-nowrap min-w-full">
            {league.description}
          </p>
        </div>
      </div>
      {isSelected ? (
        <SelectedNum num={selectedIndex} onClick={onToggle} />
      ) : (
        <AddButton onClick={onToggle} />
      )}
    </div>
  )
}

function NextStepButton({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label="Next"
      onClick={onClick}
      disabled={disabled}
      className={`h-[48px] max-w-[96px] min-w-[80px] flex-1 rounded-[30px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)] relative bg-[#969cda] ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#afb5ea] cursor-pointer'
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <img src={assets.arrowRight} alt="" className="w-[18px] h-[14px]" />
      </div>
    </button>
  )
}

export function BackYourLeague({ onClose, onNext }: { onClose?: () => void; onNext?: () => void }) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="bg-[#46383a] flex flex-col items-start pb-[11px] px-[11px] w-full max-w-[382px] h-[816px] mx-auto">
      <div className="flex h-[48px] items-center justify-between opacity-[0.66] px-[4px] w-full shrink-0">
        <div className="flex gap-[6px] items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="-scale-y-100 rotate-180">
              <div className="h-[18px] overflow-hidden relative w-[22px]">
                <img src={assets.rorrLogoStroke} alt="" className="absolute inset-[0.03%_19.61%_-0.09%_19.66%]" />
                <img src={assets.rorrLogoFill} alt="" className="absolute inset-[2.93%_22.01%_2.81%_22.06%]" />
              </div>
            </div>
          </div>
          <p className="font-light leading-[20px] text-[14px] text-white whitespace-nowrap">RORR</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="relative size-[12.414px] cursor-pointer hover:opacity-80"
        >
          <img src={assets.closeIcon} alt="" className="absolute inset-0 size-full" />
        </button>
      </div>

      <div className="bg-[#f0f2f5] flex flex-1 items-start min-h-0 min-w-[288px] overflow-hidden rounded-[16px] w-full relative">
        <div className="flex flex-1 flex-col gap-[16px] h-full items-start min-w-0 overflow-y-auto pb-[80px] pt-[12px] px-[16px] relative">
          <div className="flex flex-col gap-[4px] h-[68px] items-start text-black w-[215px] shrink-0">
            <p className="font-semibold leading-[1.5] text-[24px] w-full">Back Your League</p>
            <p className="font-light leading-[20px] text-[14px] w-full">Follow your favorite Leagues</p>
          </div>
          {leagues.map((league) => {
            const idx = selected.indexOf(league.id)
            return (
              <LeagueCard
                key={league.id}
                league={league}
                selectedIndex={idx >= 0 ? idx + 1 : 0}
                onToggle={() => toggleSelection(league.id)}
              />
            )
          })}
        </div>

        <div className="absolute right-0 top-0 flex flex-col gap-[4px] items-start p-[10px]">
          <button
            type="button"
            aria-label="Search"
            className="flex items-center justify-center rounded-full size-[24px] bg-[#969cda] relative cursor-pointer hover:bg-[#afb5ea]"
          >
            <img src={assets.searchIcon} alt="" className="size-[14px]" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex gap-[10px] items-center justify-center px-[16px] py-[8px] backdrop-blur-[3px] bg-[rgba(255,255,255,0.01)]">
          <div className="h-[48px] max-w-[96px] min-w-[80px] flex-1 opacity-0" />
          <div className="flex flex-1 gap-[4px] items-center max-w-[190px] min-w-0 px-[5px] py-[10px]">
            <div className="flex flex-1 flex-col items-center justify-center min-w-0">
              <div className="bg-[#2d39b4] h-[8px] rounded-[4px] w-full" />
            </div>
            <div className="flex flex-1 items-center justify-center min-w-0">
              <div className="bg-[#b2bac3] rounded-[4px] size-[8px]" />
            </div>
            <div className="flex flex-1 items-center justify-center min-w-0">
              <div className="bg-[#b2bac3] rounded-[4px] size-[8px]" />
            </div>
          </div>
          <NextStepButton onClick={onNext} disabled={selected.length === 0} />
        </div>
      </div>
    </div>
  )
}
