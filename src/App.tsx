import { useEffect } from 'react'
import { LoginPage } from './pages/LoginPage'
import { BackYourLeague } from './components/BackYourLeague'
import { useAuth } from './hooks/useAuth'
import { useHashRoute } from './hooks/useHashRoute'

function App() {
  const [path, navigate] = useHashRoute()
  const { user, signOut } = useAuth()

  useEffect(() => {
    if (path === '/leagues' && !user) {
      navigate('/')
    }
  }, [path, user, navigate])

  if (path === '/leagues' && user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-6">
        <BackYourLeague onClose={() => {
          signOut()
          navigate('/')
        }} />
      </div>
    )
  }

  return (
    <LoginPage
      onClose={() => navigate('/')}
      onSignedIn={() => navigate('/leagues')}
    />
  )
}

export default App
