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
        grotesk: [
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
        trust: {
          DEFAULT: '#0052cc',
          hover: '#0747a6',
          active: '#003e99',
          tint: '#e7efff',
        },
        clarity: {
          bg: '#f7f9fc',
          surface: '#ffffff',
          border: '#dbe1ea',
          ink: '#0b1f33',
          muted: '#5c6b7a',
          danger: '#c0392b',
        },
      },
      boxShadow: {
        clarity: '0 1px 2px rgba(11,31,51,0.04), 0 8px 24px rgba(11,31,51,0.08)',
      },
      borderRadius: {
        clarity: '8px',
      },
    },
  },
  plugins: [],
} satisfies Config
