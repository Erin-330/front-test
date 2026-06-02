# front-test

Next.js (App Router) + NextAuth.js v5 기반 GitHub OAuth 로그인 / 프로필 데모.

## 인증 흐름

1. `/` 또는 `/login` 에서 **GitHub으로 로그인** 클릭
2. NextAuth 의 GitHub Provider 가 OAuth 절차 진행
3. 콜백 URL `/api/auth/callback/github` 에서 세션(JWT)을 발급
4. 로그인 성공 시 자동으로 `/profile` 로 리디렉션
5. `/profile`, `/dashboard` 는 미들웨어로 보호 — 비로그인 사용자는 `/login?callbackUrl=...` 로 리디렉션
6. 이미 로그인한 사용자가 `/login` 으로 가면 `/profile` 로 다시 리디렉션

## 디렉터리

```
src/
  auth.ts                       # NextAuth 설정, 보호 라우트, authorized 콜백
  middleware.ts                 # 모든 요청을 auth 미들웨어로 통과시킴
  app/
    layout.tsx
    globals.css
    page.tsx                    # 홈 (로그인 시 /profile 로 리디렉션)
    login/page.tsx              # GitHub 로그인 폼
    profile/page.tsx            # 이름·이메일·아바타·GitHub 아이디 표시
    dashboard/page.tsx          # /profile 로 리디렉션 (별칭)
    api/auth/[...nextauth]/route.ts  # NextAuth 핸들러
```

## 실행

```bash
cp .env.example .env.local
# .env.local 에 AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET 채우기
npm install
npm run dev
```

GitHub OAuth App 생성 시 콜백 URL: `http://localhost:3000/api/auth/callback/github`
