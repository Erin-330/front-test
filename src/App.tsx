import { useState } from 'react'
import { BackYourLeague } from './components/BackYourLeague'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.83h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.24c1.9-1.75 2.96-4.32 2.96-7.34z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.81-1.75-5.6-4.11H1.07v2.59A10 10 0 0 0 10 20z"
      />
      <path
        fill="#FBBC05"
        d="M4.4 11.92a6 6 0 0 1 0-3.84V5.49H1.07a10 10 0 0 0 0 9.02l3.33-2.59z"
      />
      <path
        fill="#EA4335"
        d="M10 3.96c1.47 0 2.79.51 3.83 1.5l2.87-2.87A10 10 0 0 0 1.07 5.49L4.4 8.08C5.19 5.72 7.4 3.96 10 3.96z"
      />
    </svg>
  )
}

function SignIn({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-10 p-8">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
          RORR
        </h1>
        <p className="mt-3 text-gray-500 tracking-wide">Back Your League</p>
      </div>
      <button
        type="button"
        onClick={onSignIn}
        className="inline-flex items-center gap-3 bg-white text-gray-800 font-medium rounded-full px-6 h-12 shadow-md hover:shadow-lg hover:bg-gray-50 active:bg-gray-100 transition"
      >
        <GoogleIcon />
        <span>Sign in with Google</span>
      </button>
    </div>
  )
}

function App() {
  const [signedIn, setSignedIn] = useState(false)

  if (!signedIn) {
    return <SignIn onSignIn={() => setSignedIn(true)} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-6">
      <BackYourLeague onClose={() => setSignedIn(false)} />
    </div>
  )
}

export default App
