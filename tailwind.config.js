/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // LAZISMU official palette
        lazismu: {
          green: '#0F5C3F', // primary / header
          'green-dark': '#0A4329',
          'green-light': '#1A7A56',
          orange: '#F5821F', // accent
          'orange-dark': '#D96E0F',
          'orange-light': '#FBA94A',
          cream: '#FBF7F0', // background
          'cream-dark': '#F0E8D8',
          gold: '#C9A227',
        },
        neutral: {
          900: '#1A1A1A',
          800: '#262626',
          700: '#404040',
          600: '#525252',
          500: '#737373',
          400: '#A3A3A3',
          300: '#D4D4D4',
          200: '#E5E5E5',
          100: '#F5F5F5',
          50: '#FAFAFA',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(15, 92, 63, 0.08)',
        card: '0 4px 24px rgba(15, 92, 63, 0.10)',
        lift: '0 12px 40px rgba(15, 92, 63, 0.18)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out both',
        slideFade: 'slideFade 0.7s ease-out both',
        scaleIn: 'scaleIn 0.25s ease-out both',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
