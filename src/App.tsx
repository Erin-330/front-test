import { LoginPage } from './components/LoginPage'

function App() {
  return (
    <LoginPage
      onSubmit={(values) => {
        console.log('login submit', values)
      }}
      onSignUpClick={() => alert('회원가입 화면으로 이동')}
      onForgotPasswordClick={() => alert('비밀번호 찾기 화면으로 이동')}
    />
  )
}

export default App
