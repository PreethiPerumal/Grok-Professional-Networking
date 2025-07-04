/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo-600
          hover: '#4338CA',   // Indigo-700
        },
        purpleDark: {
          900: '#2d0b4e',
          800: '#3a185a',
          700: '#4b206b',
          600: '#6c2eb7',
          500: '#a259f7',
          400: '#c084fc',
        },
        purpleAccent: {
          500: '#a259f7',
          400: '#c084fc',
          300: '#e0aaff',
        },
        lightBg: '#f8f8ff',
        cardLight: '#fff',
        cardDark: '#2d0b4e',
      },
      boxShadow: {
        'glow-purple': '0 4px 32px 0 rgba(162,89,247,0.4)',
        'glow-blue': '0 4px 32px 0 rgba(76,110,245,0.3)',
        'glass': '0 8px 32px 0 rgba(58,24,90,0.37)',
      },
    },
  },
  plugins: [],
} 