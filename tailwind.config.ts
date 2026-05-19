import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d2518',
        gold: '#c49e44',
        cream: '#f0e8d5',
      },
      fontFamily: {
        serif: ['Georgia', 'Palatino', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
