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
        accent: '#00e4a1',
        dark: '#0f1115',
        light: '#f8f9fa',
        'dark-card': '#1a1e27',
        'light-card': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'large': '1rem',
      },
    },
  },
  plugins: [],
} 