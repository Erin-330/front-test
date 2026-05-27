import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, HERO_BANNER, type NewsCategory } from './api'
import { useInfiniteScroll, useLiveMatches, useNewsFeed } from './hooks'
import {
  BellIcon,
  ChevronRightIcon,
  CloseIcon,
  HomeIcon,
  MatchIcon,
  MenuIcon,
  NewsIcon,
  ProfileIcon,
  SearchIcon,
} from './icons'
import { LiveTicker } from './components/LiveTicker'
import { HighlightBanner } from './components/HighlightBanner'
import { CategoryTabs } from './components/CategoryTabs'
import { NewsList } from './components/NewsList'

type NavKey = 'home' | 'news' | 'matches' | 'profile'

interface EsportsNewsPageProps {
  onSelectMatch?: (matchId: string) => void
  onSelectArticle?: (articleId: string) => void
  onNavigate?: (key: NavKey) => void
}

export function EsportsNewsPage({
  onSelectMatch,
  onSelectArticle,
  onNavigate,
}: EsportsNewsPageProps) {
  const [category, setCategory] = useState<NewsCategory>('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeNav, setActiveNav] = useState<NavKey>('home')

  const { matches, loading: matchesLoading } = useLiveMatches()
  const feed = useNewsFeed(category)

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return feed.items
    const term = searchTerm.trim().toLowerCase()
    return feed.items.filter(
      (n) =>
        n.title.toLowerCase().includes(term) ||
        n.summary.toLowerCase().includes(term),
    )
  }, [feed.items, searchTerm])

  const sentinelRef = useInfiniteScroll(feed.loadMore, feed.hasMore && !searchTerm)

  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [drawerOpen])

  const handleNav = (key: NavKey) => {
    setActiveNav(key)
    onNavigate?.(key)
  }

  return (
    <div className="min-h-full bg-azure-surface font-display text-azure-ink">
      <div className="mx-auto flex min-h-full w-full max-w-[480px] flex-col bg-white shadow-[0_0_60px_rgba(0,32,90,0.08)]">
        <AppBar
          onOpenMenu={() => setDrawerOpen(true)}
          onToggleSearch={() => setSearchOpen((v) => !v)}
          searchOpen={searchOpen}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <main className="flex-1 pb-[88px]">
          <section className="border-b border-azure-border bg-white">
            <SectionHeader title="Live Now" actionLabel="See all" />
            <LiveTicker
              matches={matches}
              loading={matchesLoading}
              onSelect={(id) => onSelectMatch?.(id)}
            />
          </section>

          <section className="px-4 pt-5">
            <HighlightBanner
              banner={HERO_BANNER}
              onClick={() => onSelectArticle?.('hero')}
            />
          </section>

          <section className="pt-6">
            <SectionHeader title="Latest News" />
            <CategoryTabs
              categories={CATEGORIES}
              active={category}
              onChange={setCategory}
            />
            <div className="px-4 pt-4">
              <NewsList
                items={filteredItems}
                loading={feed.loading}
                loadingMore={feed.loadingMore}
                hasMore={feed.hasMore && !searchTerm}
                sentinelRef={sentinelRef}
                error={feed.error}
                emptyMessage={
                  searchTerm
                    ? `'${searchTerm}'에 해당하는 뉴스가 없습니다.`
                    : '표시할 뉴스가 없습니다.'
                }
                onSelect={(id) => onSelectArticle?.(id)}
              />
            </div>
          </section>
        </main>

        <BottomNav active={activeNav} onChange={handleNav} />
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

interface AppBarProps {
  onOpenMenu: () => void
  onToggleSearch: () => void
  searchOpen: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
}

function AppBar({
  onOpenMenu,
  onToggleSearch,
  searchOpen,
  searchTerm,
  onSearchChange,
}: AppBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-azure-border bg-white/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="메뉴 열기"
          className="flex h-10 w-10 items-center justify-center rounded-full text-azure-ink transition-colors hover:bg-azure-50 active:bg-azure-100"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        <h1 className="font-display text-[15px] font-extrabold tracking-[0.18em] text-azure-600">
          ESPORTS CENTRAL
        </h1>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleSearch}
            aria-label="검색"
            aria-pressed={searchOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-azure-ink transition-colors hover:bg-azure-50 active:bg-azure-100"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="알림"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-azure-ink transition-colors hover:bg-azure-50 active:bg-azure-100"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 inline-flex h-2 w-2 rounded-full bg-azure-live ring-2 ring-white" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-azure-border bg-white px-4 py-2.5">
          <label className="flex items-center gap-2 rounded-full bg-azure-surface px-3 py-2">
            <SearchIcon className="h-4 w-4 text-azure-muted" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="뉴스 검색"
              className="flex-1 bg-transparent text-[14px] text-azure-ink placeholder:text-azure-muted/80 focus:outline-none"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                aria-label="검색어 지우기"
                onClick={() => onSearchChange('')}
                className="text-azure-muted transition-colors hover:text-azure-ink"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>
      )}
    </header>
  )
}

function SectionHeader({
  title,
  actionLabel,
}: {
  title: string
  actionLabel?: string
}) {
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-5">
      <h2 className="font-display text-[18px] font-bold tracking-tight text-azure-ink">
        {title}
      </h2>
      {actionLabel && (
        <button
          type="button"
          className="flex items-center gap-0.5 text-[12px] font-semibold text-azure-600 transition-colors hover:text-azure-700"
        >
          {actionLabel}
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

interface BottomNavProps {
  active: NavKey
  onChange: (key: NavKey) => void
}

function BottomNav({ active, onChange }: BottomNavProps) {
  const items: { key: NavKey; label: string; Icon: typeof HomeIcon }[] = [
    { key: 'home', label: 'Home', Icon: HomeIcon },
    { key: 'news', label: 'News', Icon: NewsIcon },
    { key: 'matches', label: 'Matches', Icon: MatchIcon },
    { key: 'profile', label: 'Profile', Icon: ProfileIcon },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] border-t border-azure-border bg-white/95 backdrop-blur">
      <ul className="flex h-[72px] items-center justify-around px-2">
        {items.map(({ key, label, Icon }) => {
          const isActive = active === key
          return (
            <li key={key} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(key)}
                aria-current={isActive ? 'page' : undefined}
                className="flex w-full flex-col items-center gap-1 py-2 text-[11px] font-semibold tracking-wide transition-colors"
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                    isActive ? 'bg-azure-100 text-azure-600' : 'text-azure-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className={isActive ? 'text-azure-600' : 'text-azure-muted'}>
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const links = [
    'Home',
    'My Feed',
    'Following Teams',
    'Schedule',
    'Standings',
    'VOD',
    'Settings',
  ]

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 transition-opacity ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <button
        type="button"
        aria-label="메뉴 닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <aside
        className={`absolute left-0 top-0 h-full w-[78%] max-w-[320px] bg-white shadow-2xl transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-azure-border px-4 py-4">
          <span className="font-display text-[14px] font-extrabold tracking-[0.18em] text-azure-600">
            ESPORTS CENTRAL
          </span>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-azure-ink hover:bg-azure-50"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <ul className="px-2 py-2">
          {links.map((label) => (
            <li key={label}>
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-azure-ink transition-colors hover:bg-azure-50"
              >
                {label}
                <ChevronRightIcon className="h-4 w-4 text-azure-muted" />
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
