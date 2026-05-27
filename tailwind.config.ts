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
        brand: {
          bg: '#46383a',
          card: '#F0F2F5',
          ink: '#202020',
        },
        azure: {
          primary: '#0052cc',
          'primary-hover': '#0747a6',
          'primary-active': '#053780',
          surface: '#ffffff',
          bg: '#f4f6fb',
          ink: '#1a1f2c',
          muted: '#5b6478',
          border: '#dfe3ec',
          error: '#ba1a1a',
        },
      },
      boxShadow: {
        'azure-card': '0 8px 24px rgba(0, 82, 204, 0.08)',
      },
      borderRadius: {
        azure: '8px',
      },
    },
  },
  plugins: [],
} satisfies Config
