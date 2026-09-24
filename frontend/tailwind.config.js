/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#F5F8FC',
          100: '#E8F2FC',
          200: '#D0E3F9',
          500: '#1464B4',
          600: '#0B5CAD',
          700: '#08488A',
          800: '#063669',
          900: '#042447',
        },
        cardio: {
          teal: '#0F9D9A',
          tealLight: '#E8F7F6',
          red: '#E63950',
          redLight: '#FDF2F4',
          green: '#22A06B',
          greenLight: '#EAF8F2',
          amber: '#F59E0B',
          amberLight: '#FEF8E7',
          navy: '#172B4D',
          slate: '#64748B',
          border: '#E2E8F0',
          bg: '#F5F8FC'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
