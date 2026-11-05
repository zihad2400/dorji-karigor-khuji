/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-background)',
        surface: 'var(--bg-surface)',
        surfaceHover: 'var(--bg-surface-hover)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        primary: {
          DEFAULT: '#9b59b6',
          dark: '#8e44ad',
          light: '#af7ac5',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        bengali: ['var(--font-hind-siliguri)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
