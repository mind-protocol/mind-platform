/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        // Layer colors
        layer: {
          L1: '#3b82f6', // Blue - Citizen
          L2: '#22c55e', // Green - Organization
          L3: '#8b5cf6', // Purple - Ecosystem
          L4: '#f59e0b', // Amber - Protocol
        },
      },
    },
  },
  plugins: [],
}
