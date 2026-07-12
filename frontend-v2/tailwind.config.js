/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#FF5A5F',
        'brand-purple': '#6E00FF',
        'brand-yellow': '#E8FF00',
        'brand-cyan': '#00D4FF',
        'brand-black': '#0F0A1A',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'comic': '4px 4px 0px 0px #0F0A1A',
        'comic-hover': '8px 8px 0px 0px #0F0A1A',
        'comic-active': '0px 0px 0px 0px #0F0A1A',
        'comic-sm': '2px 2px 0px 0px #0F0A1A',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }
    },
  },
  plugins: [],
}
