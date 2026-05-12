import { Button } from './components/Button'

function App() {
  return (
    <div className="min-h-screen bg-red-500 flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Button Component Demo</h1>

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

      <section className="flex flex-col gap-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-gray-700">Login</h2>
        <div className="flex flex-col gap-3 bg-white rounded-xl p-6 shadow-md">
          <input
            type="email"
            placeholder="이메일"
            className="h-10 px-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="h-10 px-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button variant="primary" size="lg" onClick={() => alert('로그인')}>
            로그인
          </Button>
        </div>
      </section>
    </div>
  )
}

export default App
