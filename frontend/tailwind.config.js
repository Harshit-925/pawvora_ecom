/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { 
    extend: {
      colors: {
        brand: {
          dark: 'var(--color-brand-dark)',
          primary: 'var(--color-brand-primary)',
          accent: 'var(--color-brand-accent)',
          light: 'var(--color-brand-light)',
          muted: 'var(--color-brand-muted)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      }
    } 
  },
  plugins: [],
};
