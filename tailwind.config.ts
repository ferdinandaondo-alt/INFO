import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#05070A',
        surface: '#0D1310',
        'surface-2': '#121A15',
        'surface-3': '#182119',
        border: '#1E2B22',
        paper: '#E8ECE9',
        muted: '#8A9690',
        matrix: {
          DEFAULT: '#3ECF4A',
          bright: '#5CFF6B',
          dim: '#1F7A2A',
        },
        signal: {
          DEFAULT: '#3ECF4A',
          dim: '#1F7A2A',
        },
        danger: '#E5645A',
      },
      fontFamily: {
        display: ['var(--font-jetbrains)', 'monospace'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        scanline: 'scanline 3.5s ease-in-out infinite',
        blink: 'blink 2s ease-in-out infinite',
        rise: 'rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
