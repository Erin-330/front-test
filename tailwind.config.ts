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
        display: [
          'Hanken Grotesk',
          'Pretendard',
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
          DEFAULT: '#003d9b',
          50: '#e8efff',
          100: '#cfdcff',
          200: '#9fb8ff',
          300: '#5e87f0',
          500: '#0a52c9',
          600: '#003d9b',
          700: '#002c70',
          ink: '#0d1b3d',
          muted: '#5b6b8f',
          surface: '#f4f6fb',
          border: '#dfe5f1',
          live: '#e02d3c',
        },
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
