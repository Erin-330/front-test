import { useEffect } from 'react'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { useAuth } from './hooks/useAuth'
import { useHashRoute } from './hooks/useHashRoute'

function App() {
  const [path, navigate] = useHashRoute()
  const { user, signOut } = useAuth()

  useEffect(() => {
    if (path === '/profile' && !user) {
      navigate('/login')
    }
  }, [path, user, navigate])

  if (path === '/profile' && user) {
    return (
      <ProfilePage
        user={user}
        onSignOut={() => {
          signOut()
          navigate('/login')
        }}
        onClose={() => navigate('/')}
      />
    )
  }

  return (
    <LoginPage
      onClose={() => navigate('/')}
      onSignedIn={() => navigate('/profile')}
    />
  )
}

export default App
