/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Royal-blue brand ramp (matches the redesign mockups).
        brand: {
          50: '#eef2ff',
          100: '#e0e8ff',
          200: '#c4d1ff',
          300: '#9db2ff',
          400: '#6f8bff',
          500: '#4f6bff',
          600: '#3b5bfd',
          700: '#2f49d6',
          800: '#2a3fae',
          900: '#273a8a',
        },
        mint: {
          50: '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        // Deep-navy surfaces for dark mode.
        ink: {
          DEFAULT: '#0a0e19',
          card: '#141a2b',
          border: '#232a3d',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)',
        soft: '0 8px 30px rgba(16,24,40,0.06)',
        glow: '0 0 0 1px rgba(59,91,253,0.15), 0 12px 40px rgba(59,91,253,0.25)',
      },
    },
  },
  plugins: [],
}
