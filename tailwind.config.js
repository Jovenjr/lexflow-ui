
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0e1628',
        'brand-light': '#141e32',
        'brand-primary': '#1e88e5'
      }
    },
  },
  plugins: [],
}
