import { useEffect } from 'react'
import { LoginPage } from './pages/LoginPage'
import { MainPage } from './pages/MainPage'
import { BackYourLeague } from './components/BackYourLeague'
import { BackYourTeam } from './components/BackYourTeam'
import { useAuth } from './hooks/useAuth'
import { useHashRoute } from './hooks/useHashRoute'

function App() {
  const [path, navigate] = useHashRoute()
  const { user, signOut } = useAuth()

  useEffect(() => {
    if ((path === '/leagues' || path === '/teams') && !user) {
      navigate('/login')
    }
  }, [path, user, navigate])

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

  if (path === '/teams' && user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-6">
        <BackYourTeam
          onClose={() => {
            signOut()
            navigate('/')
          }}
          onBack={() => navigate('/leagues')}
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
