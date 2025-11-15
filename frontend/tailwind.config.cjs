/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#4A9B9F',
          600: '#2C7A7B',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd1c7',
          300: '#ffb09f',
          400: '#FF8B7B',
          500: '#ff6b57',
          600: '#f04438',
          700: '#d92d20',
          800: '#b42318',
          900: '#912018',
        },
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'slideInRight': 'slideInRight 0.6s ease-out',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
