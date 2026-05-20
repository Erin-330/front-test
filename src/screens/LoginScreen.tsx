import { useState } from 'react'
import { Button } from '../components/Button'

type LoginScreenProps = {
  onBack: () => void
}

export function LoginScreen({ onBack }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.')
      return
    }
    alert(`로그인 시도: ${email}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">로그인</h1>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button variant="primary" size="md" onClick={handleLogin}>
            로그인
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={onBack}>
          ← 메인으로
        </Button>
      </div>
    </div>
  )
}
