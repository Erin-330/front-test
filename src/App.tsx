import { useEffect } from 'react'
import { LoginPage } from './pages/LoginPage'
import { MainPage } from './pages/MainPage'
import { EsportsNewsPage } from './pages/EsportsNewsPage'
import { BackYourLeague } from './components/BackYourLeague'
import { BackYourTeam } from './components/BackYourTeam'
import { BackYourPlayer } from './components/BackYourPlayer'
import { useAuth } from './hooks/useAuth'
import { useHashRoute } from './hooks/useHashRoute'

function App() {
  const [path, navigate] = useHashRoute()
  const { user, signOut } = useAuth()

  useEffect(() => {
    if ((path === '/leagues' || path === '/teams' || path === '/players') && !user) {
      navigate('/login')
    }
  }, [path, user, navigate])

  const isNewsRoute =
    path === '/' ||
    path === '/news' ||
    path === '/matches' ||
    path.startsWith('/news/') ||
    path.startsWith('/matches/')

  if (isNewsRoute) {
    return (
      <EsportsNewsPage
        onSelectMatch={(id) => navigate(`/matches/${id}`)}
        onSelectArticle={(id) => navigate(`/news/${id}`)}
        onNavigate={(key) => {
          if (key === 'profile') {
            navigate(user ? '/leagues' : '/login')
          } else if (key === 'home' || key === 'news') {
            navigate('/news')
          } else if (key === 'matches') {
            navigate('/matches')
          }
        }}
      />
    )
  }

  if (path === '/legacy') {
    return (
      <MainPage
        onLogin={() => navigate('/login')}
        onLeague={() => navigate('/leagues')}
      />
    )
  }

  if (path === '/players' && user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-6">
        <BackYourPlayer
          onClose={() => {
            signOut()
            navigate('/')
          }}
          onBack={() => navigate('/teams')}
          onDone={() => {
            signOut()
            navigate('/')
          }}
        />
      </div>
    )
  }

  if (path === '/teams' && user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-6">
        <BackYourTeam
          onClose={() => {
            signOut()
            navigate('/')
          }}
          onBack={() => navigate('/leagues')}
          onNext={() => navigate('/players')}
        />
      </div>
    )
  }

  if (path === '/leagues' && user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-6">
        <BackYourLeague
          onClose={() => {
            signOut()
            navigate('/')
          }}
          onNext={() => navigate('/teams')}
        />
      </div>
    )
  }

  if (path === '/login') {
    return (
      <LoginPage
        onClose={() => navigate('/')}
        onSignedIn={() => navigate('/leagues')}
      />
    )
  }

  return (
    <MainPage
      onLogin={() => navigate('/login')}
      onLeague={() => navigate('/leagues')}
    />
  )
}

export default App
