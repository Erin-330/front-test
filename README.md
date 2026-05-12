# RORR

React + TypeScript + Vite + Tailwind CSS 기반의 프론트엔드 프로젝트입니다.

## 기술 스택

- **React** 18
- **TypeScript** 5
- **Vite** 5
- **Tailwind CSS** 3

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 타입 체크
npm run type-check
```

## 프로젝트 구조

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx        # 버튼 컴포넌트
│       ├── Button.types.ts   # 타입 정의
│       └── index.ts          # 진입점
├── App.tsx
├── main.tsx
└── index.css
```

## 컴포넌트

### Button

공통 버튼 컴포넌트로 variant, size, loading, disabled 상태를 지원합니다.

```tsx
import { Button } from './components/Button'

<Button variant="primary" size="md" onClick={() => {}}>
  클릭
</Button>
```

#### Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `variant` | `primary` \| `secondary` \| `danger` \| `ghost` | `primary` | 버튼 스타일 |
| `size` | `sm` \| `md` \| `lg` | `md` | 버튼 크기 |
| `loading` | `boolean` | `false` | 로딩 상태 (스피너 표시, 클릭 비활성화) |
| `disabled` | `boolean` | `false` | 비활성화 상태 |
| `aria-label` | `string` | - | 접근성 레이블 |
