import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:        '#C9A55A',
        'primary-hover':'#E8C675',
        terracotta:     '#B5501B',
        'main-bg':      '#0A0A0A',
        'card-bg':      '#111111',
        'nav-bg':       '#1A1A1A',
      },
      fontFamily: {
        body:     ['var(--font-outfit)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none:    '0px',
        sm:      '2px',
        md:      '4px',
        lg:      '0px',
        xl:      '0px',
        '2xl':   '0px',
        full:    '9999px',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'slide-in': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
      },
      animation: {
        'fade-in':  'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
