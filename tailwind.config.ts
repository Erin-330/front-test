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
          'primary-soft': '#e6ecf6',
          surface: '#ffffff',
          'surface-muted': '#f6f7fb',
          border: '#d8dbe2',
          'border-strong': '#b4b9c4',
          ink: '#0b1220',
          'ink-muted': '#5b6473',
          'ink-subtle': '#8a93a3',
          danger: '#d23a3a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
