import type { FeedCategory, FeedCategoryOption } from '../types'

export const CATEGORY_OPTIONS: FeedCategoryOption[] = [
  { id: 'all', label: 'All', apiParam: 'all' },
  { id: 'lol', label: 'League of Legends', apiParam: 'lol' },
  { id: 'valorant', label: 'Valorant', apiParam: 'valorant' },
  { id: 'cs2', label: 'CS2', apiParam: 'cs2' },
]

interface CategoryTabsProps {
  selected: FeedCategory
  onSelect: (id: FeedCategory) => void
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <nav
      className="sticky top-14 z-20 -mx-0 border-b border-azure-border bg-azure-bg/95 px-4 backdrop-blur-md"
      aria-label="News categories"
    >
      <div
        className="-mx-4 flex gap-1 overflow-x-auto px-4"
        style={{ scrollbarWidth: 'none' }}
        role="tablist"
      >
        {CATEGORY_OPTIONS.map((opt) => {
          const isActive = selected === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(opt.id)}
              className={[
                'relative shrink-0 px-3 py-3 font-hanken text-[13px] font-semibold transition-colors focus:outline-none',
                isActive ? 'text-white' : 'text-azure-ink-muted hover:text-white',
              ].join(' ')}
            >
              {opt.label}
              <span
                className={[
                  'absolute inset-x-2 -bottom-px h-[2px] rounded-full transition-opacity',
                  isActive ? 'bg-azure-trust opacity-100' : 'bg-azure-trust opacity-0',
                ].join(' ')}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
