import { useState } from 'react'
import { Button } from './components/Button'

function App() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  function handleLogin() {
    setIsLoggingIn(true)
    setTimeout(() => setIsLoggingIn(false), 2000)
  }

  return (
    <div className="min-h-screen bg-red-500 flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Button Component Demo</h1>

      <section className="flex flex-col gap-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-gray-700">로그인</h2>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
          <p className="text-sm text-gray-500">서비스를 이용하려면 로그인하세요.</p>
          <Button variant="primary" size="lg" loading={isLoggingIn} onClick={handleLogin} className="w-full">
            {isLoggingIn ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-gray-700">Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => alert('primary')}>Primary</Button>
          <Button variant="secondary" onClick={() => alert('secondary')}>Secondary</Button>
          <Button variant="danger" onClick={() => alert('danger')}>Danger</Button>
          <Button variant="ghost" onClick={() => alert('ghost')}>Ghost</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-gray-700">Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-gray-700">States</h2>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button variant="secondary" loading>Loading Secondary</Button>
        </div>
      </section>
    </div>
  )
}

export default App
