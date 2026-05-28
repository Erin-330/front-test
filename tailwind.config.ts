import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          'sans-serif',
        ],
        hanken: [
          'Hanken Grotesk',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          bg: '#46383a',
          card: '#F0F2F5',
          ink: '#202020',
        },
        azure: {
          primary: '#003d9b',
          primaryDark: '#002c75',
          primaryLight: '#1e58c0',
          accent: '#0ea5e9',
          surface: '#ffffff',
          background: '#f6f8fb',
          border: '#e2e8f0',
          ink: '#0b1726',
          muted: '#5b6b80',
          live: '#dc2626',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
