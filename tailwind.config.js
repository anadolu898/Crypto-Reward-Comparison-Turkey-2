/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0CD4B5',
        secondary: '#220D53',
        accent: '#0CD4B5',
        'accent-alt': '#09A38A',
        dark: '#220D53',
        light: '#f8f9fa',
        'dark-card': '#2D1B5E',
        'light-card': '#ffffff',
        'gradient-start': '#220D53',
        'gradient-end': '#0CD4B5',
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