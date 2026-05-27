import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Hanken Grotesk',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'sans-serif',
        ],
      },
      colors: {
        trust: {
          blue: '#0052cc',
          'blue-dark': '#003d99',
          'blue-light': '#e6efff',
        },
        ink: {
          DEFAULT: '#111827',
          muted: '#6b7280',
          subtle: '#9ca3af',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f8fafc',
          border: '#e5e7eb',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 2px 8px 0 rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config
