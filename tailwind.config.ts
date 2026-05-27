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
          'Roboto',
          'Helvetica Neue',
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
          trust: '#003d9b',
          'trust-hover': '#0050c8',
          'trust-light': '#1a5fb8',
          bg: '#0a0e1a',
          surface: '#111827',
          'surface-2': '#1a2032',
          border: '#1f2937',
          ink: '#e5e7eb',
          'ink-muted': '#9ca3af',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
