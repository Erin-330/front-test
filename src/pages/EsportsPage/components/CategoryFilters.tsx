import type { GameCategory } from '../types'

interface CategoryFiltersProps {
  active: GameCategory
  onChange: (next: GameCategory) => void
}

const CATEGORIES: GameCategory[] = ['All', 'League of Legends', 'Valorant', 'CS2']

export function CategoryFilters({ active, onChange }: CategoryFiltersProps) {
  return (
    <nav
      aria-label="News categories"
      className="sticky top-14 z-20 border-b border-azure-border bg-white"
    >
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORIES.map((category) => {
          const isActive = category === active
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(category)}
              className={[
                'shrink-0 rounded-full px-4 py-2 font-hanken text-[13px] font-semibold transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-primary',
                isActive
                  ? 'bg-azure-primary text-white shadow-[0_2px_6px_rgba(0,61,155,0.25)]'
                  : 'bg-azure-background text-azure-ink hover:bg-azure-border/70 active:bg-azure-border',
              ].join(' ')}
            >
              {category}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
