import { useEffect } from 'react'
import { LoginPage } from './pages/LoginPage'
import { MainPage } from './pages/MainPage'
import { UserDetailPage } from './pages/UserDetailPage'
import { BackYourLeague } from './components/BackYourLeague'
import { BackYourTeam } from './components/BackYourTeam'
import { BackYourPlayer } from './components/BackYourPlayer'
import { useAuth } from './hooks/useAuth'
import { useHashRoute } from './hooks/useHashRoute'

const USER_DETAIL_PREFIX = '/users/'

function App() {
  const [path, navigate] = useHashRoute()
  const { user, signOut } = useAuth()

  useEffect(() => {
    if ((path === '/leagues' || path === '/teams' || path === '/players') && !user) {
      navigate('/login')
    }
  }, [path, user, navigate])

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

  if (path.startsWith(USER_DETAIL_PREFIX)) {
    const userId = decodeURIComponent(path.slice(USER_DETAIL_PREFIX.length))
    if (userId) {
      return (
        <UserDetailPage
          userId={userId}
          onBack={() => navigate('/users')}
          onClose={() => navigate('/')}
        />
      )
    }
  }

  return (
    <MainPage
      onLogin={() => navigate('/login')}
      onLeague={() => navigate('/leagues')}
    />
  )
}

export default App
