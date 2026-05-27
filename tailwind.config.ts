import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Hanken Grotesk',
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
      },
      colors: {
        brand: {
          bg: '#46383a',
          card: '#F0F2F5',
          ink: '#202020',
        },
        clarity: {
          primary: '#003d9b',
          'primary-hover': '#002f78',
          'primary-pressed': '#002359',
          surface: '#f5f7fb',
          'surface-alt': '#eef1f7',
          card: '#ffffff',
          border: '#dde2eb',
          'border-strong': '#c4cbd6',
          ink: '#0f172a',
          'ink-muted': '#475569',
          'ink-subtle': '#94a3b8',
          danger: '#dc2626',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
