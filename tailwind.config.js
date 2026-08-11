/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        ai: {
          cyan: '#00f2fe',
          purple: '#4facfe',
          violet: '#7f00ff',
          neon: '#00ffcc'
        },
        dark: {
          bg: '#0b0f19',
          card: '#131b2e',
          border: '#1e293b',
          hover: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      boxShadow: {
        glow: '0 0 25px -5px rgba(2, 132, 199, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(127, 0, 255, 0.4)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
