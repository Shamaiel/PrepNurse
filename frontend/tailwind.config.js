/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          500: '#334E68',
          800: '#102A43',
          900: '#172554',
          950: '#0F172A',
        },
        purple: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#6D4AFF',
          700: '#5B3CE6',
          800: '#4C1D95',
          900: '#2E1065',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        cyan: {
          500: '#06B6D4',
          600: '#0891B2',
        },
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          500: '#6D4AFF',
          600: '#5B3CE6',
          700: '#172554',
          800: '#102A43',
          900: '#0F172A',
        },
        gold: {
          DEFAULT: '#F59E0B',
          soft: '#FEF3C7',
          dark: '#D97706',
          light: '#FBBF24',
        },
        marked: {
          DEFAULT: '#7C3AED',
          bg: '#F5F3FF',
          dark: '#A78BFA',
        },
      },
      fontFamily: {
        sans: ["Poppins", "'Plus Jakarta Sans'", "-apple-system", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'card': '0 10px 30px -10px rgba(109, 74, 255, 0.08)',
        'glow-purple': '0 0 25px -5px rgba(109, 74, 255, 0.35)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.35)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      }
    },
  },
  plugins: [],
}
