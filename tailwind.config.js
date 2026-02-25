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
        // Venice / Serenissima palette
        venice: {
          copper: { DEFAULT: '#D4920B', light: '#E8B44A', dark: '#B87A08' },
          gold: '#D4AF37',
          forestieri: '#4CAF50',   // olive green
          artisti: { DEFAULT: '#FF69B4', soft: '#FFB6C1' },
          facchini: '#808080',     // grey
          scientisti: '#9370DB',   // purple
          clero: '#FFFDF5',       // candle wax
          cittadini: '#4682B4',    // steel blue
          nobili: { DEFAULT: '#B22222', gold: '#DAA520' },
          ambasciatori: '#00CED1', // turquoise
          crimson: '#DC2626',
          parchment: { DEFAULT: '#F5ECD7', light: '#FBF6EC', dark: '#EEE5D0' },
          ink: { DEFAULT: '#2C2416', light: '#5C4E3C', muted: '#9A8C78', heading: '#CC7A00' },
        },
      },
    },
  },
  plugins: [],
}
