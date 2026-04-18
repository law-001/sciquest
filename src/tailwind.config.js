
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
        science: {
          dark: '#44403c',
          light: '#fdf6e3',
          cream: '#fdf6e3',
          peach: '#fff7ed',
          warmWhite: '#fffbf5',
          pink: '#fb7185',
          blue: '#38bdf8',
          lime: '#84cc16',
        }
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 25px -5px rgba(251, 146, 60, 0.1), 0 8px 10px -6px rgba(251, 146, 60, 0.05)',
        'card-hover': '0 20px 40px -8px rgba(251, 146, 60, 0.18)',
        'modal': '0 20px 25px -5px rgba(68, 64, 60, 0.1), 0 10px 10px -5px rgba(68, 64, 60, 0.04)',
        'glow': '0 0 15px -3px rgba(249, 115, 22, 0.4)',
        'glow-success': '0 0 15px -3px rgba(20, 184, 166, 0.4)',
        'glow-error': '0 0 15px -3px rgba(239, 68, 68, 0.4)',
        'warm': '0 4px 14px -2px rgba(251, 146, 60, 0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'confetti-fall': 'confetti-fall 3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '.8', filter: 'brightness(1.2)' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(1000%) rotate(720deg)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
