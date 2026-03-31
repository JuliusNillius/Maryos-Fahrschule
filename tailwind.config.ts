import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // §03 Brand colors
        green: {
          400: '#6FD934',
          500: '#5DC422',
          600: '#3D8A14',
          primary: '#5DC422',   // alias 500
          dark: '#3D8A14',     // alias 600
        },
        bg: '#080808',
        surface: '#0F0F0F',
        'surface2': '#141414', // alias card
        card: '#141414',
        card2: '#1C1C1C',
        border: 'rgba(93,196,34,0.18)',
        text: {
          DEFAULT: '#F0F0F0',
          muted: '#777777',
        },
        red: '#E53E3E',
      },
      borderRadius: {
        brand: 'var(--radius, 10px)',
      },
      boxShadow: {
        glow: 'var(--glow)',
        'glow-sm': 'var(--glow-sm)',
        'glow-lg': '0 0 50px rgba(93, 196, 34, 0.25)',
      },
      fontFamily: {
        heading: ['var(--font-barlow-condensed)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-orbitron)', 'monospace'],
        display: ['var(--font-orbitron)', 'monospace'],
      },
      keyframes: {
        'nav-stagger': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'trust-marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fine-flash': {
          '0%': { opacity: '0' },
          '35%': { opacity: '0.92' },
          '100%': { opacity: '0' },
        },
        'fine-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(255,60,60,0.45))' },
          '50%': { filter: 'drop-shadow(0 0 12px rgba(255,80,80,0.95))' },
        },
      },
      animation: {
        'nav-stagger': 'nav-stagger 0.4s ease-out forwards',
        'trust-marquee': 'trust-marquee 40s linear infinite',
        'fine-flash': 'fine-flash 0.15s ease-out forwards',
        'fine-pulse': 'fine-pulse 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
