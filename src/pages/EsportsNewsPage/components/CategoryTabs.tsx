import type { NewsCategory } from '../api'

interface CategoryTabsProps {
  categories: { id: NewsCategory; label: string }[]
  active: NewsCategory
  onChange: (id: NewsCategory) => void
}

export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="뉴스 카테고리"
      className="flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((category) => {
        const isActive = active === category.id
        return (
          <button
            key={category.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(category.id)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold tracking-tight transition-colors ${
              isActive
                ? 'bg-azure-600 text-white shadow-[0_4px_12px_rgba(0,61,155,0.3)]'
                : 'bg-azure-surface text-azure-ink/70 hover:bg-azure-100 hover:text-azure-600'
            }`}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
