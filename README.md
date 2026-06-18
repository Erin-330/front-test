# RORR

React + TypeScript + Vite + Tailwind CSS 기반의 프론트엔드 프로젝트입니다.

## 기술 스택

- **React** 18.3
- **TypeScript** 5.6
- **Vite** 5.4
- **Tailwind CSS** 3.4
- **Pretendard** 웹폰트

## 시작하기

### 사전 요구사항

- Node.js 18 이상

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

기본적으로 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
npm run build
```

빌드 결과는 `dist/` 디렉터리에 생성됩니다.

### 타입 체크

```bash
npm run type-check
```

### 프로덕션 빌드 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
.
├── index.html
├── public/
│   └── figma/                # Figma에서 가져온 에셋
├── src/
│   ├── App.tsx               # 라우팅 및 최상위 컴포넌트
│   ├── main.tsx              # 진입점
│   ├── index.css             # 전역 스타일 (Tailwind 포함)
│   ├── components/
│   │   ├── BackYourLeague/   # 리그 선택 화면
│   │   ├── BackYourTeam/     # 팀 선택 화면
│   │   ├── BackYourPlayer/   # 선수 선택 화면
│   │   ├── Button/           # 공통 버튼
│   │   ├── GoogleLoginButton/# 구글 로그인 버튼
│   │   └── Logos/            # 로고 자산
│   ├── pages/
│   │   ├── MainPage/         # 메인(랜딩) 페이지
│   │   ├── LoginPage/        # 로그인 페이지
│   │   └── ProfilePage/      # 프로필 페이지
│   └── hooks/
│       ├── useAuth.ts        # 로컬스토리지 기반 인증 훅
│       └── useHashRoute.ts   # 해시 기반 라우팅 훅
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

## 라우팅

해시(`#`) 기반의 가벼운 라우팅을 사용합니다.

| 경로 | 설명 | 인증 필요 |
| --- | --- | --- |
| `/` | 메인 페이지 | - |
| `/login` | 로그인 페이지 | - |
| `/leagues` | 응원할 리그 선택 | O |
| `/teams` | 응원할 팀 선택 | O |
| `/players` | 응원할 선수 선택 | O |

인증되지 않은 사용자가 보호된 경로에 접근하면 자동으로 `/login`으로 이동합니다.

## 인증

`useAuth` 훅이 `localStorage`(`rorr.auth.user` 키)에 사용자 정보를 저장하여 간단한 클라이언트 인증을 처리합니다.
