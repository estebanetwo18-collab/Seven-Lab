/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111312',
        night: '#0A0A0A',
        forest: '#0E2A22',
        mint: '#4FC08D',
        brand: '#1E7A56',
        sky1: '#EAF4FB',
        sky2: '#B9CFE0',
        paper: '#F4F6F5',
      },
      fontFamily: { sans: ['Manrope', 'ColonSign', 'system-ui', 'sans-serif'] },
      transitionTimingFunction: { expo: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
};
