/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#5d32f4',
        secondary: '#2e1a75',
        accent: '#00E676',
        'accent-alt': '#00e4a1',
        dark: '#0B0F1B',
        light: '#f8f9fa',
        'dark-card': '#111827',
        'light-card': '#ffffff',
        'gradient-start': '#5d32f4',
        'gradient-end': '#00C2FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'large': '1rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'hero-pattern': "url('/grid-pattern.svg')",
      },
    },
  },
  plugins: [],
} 