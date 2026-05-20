import { Button } from '../components/Button'

type BackyHourLeagueScreenProps = {
  onBack: () => void
}

export function BackyHourLeagueScreen({ onBack }: BackyHourLeagueScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold text-gray-900">Backy Hour League</h1>
      <p className="text-gray-700 text-center max-w-md">
        백키 아워 리그에 오신 것을 환영합니다.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">리그 정보</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>· 시즌: 2026 Spring</li>
          <li>· 참가 팀: 8팀</li>
          <li>· 일정: 매주 토요일</li>
        </ul>
      </div>

      <Button variant="ghost" size="md" onClick={onBack}>
        ← 메인으로
      </Button>
    </div>
  )
}
