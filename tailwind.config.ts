import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sarabun)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#C8A882',
          dark: '#A08060',
        },
      },
    },
  },
  plugins: [],
}
export default config
