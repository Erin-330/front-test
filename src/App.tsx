import { Button } from './components/Button'

function App() {
  return (
    <div className="min-h-screen bg-sky-400 flex flex-col items-center justify-center gap-8 p-8">
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
    </div>
  )
}

export default App
