import { useState } from 'react'
import { MainScreen } from './screens/MainScreen'
import { LoginScreen } from './screens/LoginScreen'
import { BackyHourLeagueScreen } from './screens/BackyHourLeagueScreen'

type Route = 'main' | 'login' | 'backyhourleague'

function App() {
  const [route, setRoute] = useState<Route>('main')

  if (route === 'login') {
    return <LoginScreen onBack={() => setRoute('main')} />
  }

  if (route === 'backyhourleague') {
    return <BackyHourLeagueScreen onBack={() => setRoute('main')} />
  }

  return (
    <MainScreen
      onNavigateLogin={() => setRoute('login')}
      onNavigateLeague={() => setRoute('backyhourleague')}
    />
  )
}

export default App
