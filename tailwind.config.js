/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf5f6',
          100: '#fbecee',
          200: '#f7d2d6',
          300: '#efabb1',
          400: '#e37780',
          500: '#d04954',
          600: '#b8323d',
          700: '#8a2228',
          800: '#731b21', // Primary brand deep royal maroon
          850: '#60151a',
          900: '#521317',
          950: '#380a0d',
        },
        gold: {
          50: '#faf8f2',
          100: '#f5f0e1',
          200: '#ebdcb6',
          300: '#dec285',
          400: '#d1a856',
          500: '#b88d35',
          600: '#9b7129',
          700: '#7b5522',
        },
        cream: {
          25: '#fefdfb',
          50: '#fbf9f4',
          100: '#f7f4ed', // Exact authentic pos background
          200: '#ede8dd',
          300: '#dfd7c7',
          400: '#c5baa6',
          500: '#a39783',
        },
        status: {
          blank: '#9ca3af',
          running: '#2563eb',
          printed: '#16a34a',
          paid: '#d97706',
          kot: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Outfit"', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        roman: ['"Times New Roman"', 'Times', 'serif'],
        marathi: ['"Rozha One"', '"Tiro Devanagari Marathi"', '"Noto Sans Devanagari"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'premium': '0 4px 20px -2px rgba(115, 27, 33, 0.12), 0 2px 6px -1px rgba(115, 27, 33, 0.08)',
        'card': '0 2px 10px rgba(84, 18, 22, 0.06)',
        'card-hover': '0 10px 25px -3px rgba(115, 27, 33, 0.15), 0 4px 10px -2px rgba(115, 27, 33, 0.08)',
        'glow-gold': '0 0 15px rgba(212, 175, 55, 0.35)',
        'glow-maroon': '0 0 15px rgba(115, 27, 33, 0.35)',
      }
    },
  },
  plugins: [],
}

