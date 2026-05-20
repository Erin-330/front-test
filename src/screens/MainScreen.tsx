import { Button } from '../components/Button'

type MainScreenProps = {
  onNavigateLogin: () => void
  onNavigateLeague: () => void
}

export function MainScreen({ onNavigateLogin, onNavigateLeague }: MainScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-gray-900">메인 화면</h1>
      <p className="text-gray-600">원하는 메뉴를 선택하세요</p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button variant="primary" size="lg" onClick={onNavigateLogin}>
          로그인
        </Button>
        <Button variant="secondary" size="lg" onClick={onNavigateLeague}>
          League
        </Button>
      </div>
    </div>
  )
}
