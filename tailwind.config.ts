import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-antonio)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        canvas: '#1e1e1e',
        panel: '#2c2c2c',
        'panel-border': '#3d3d3d',
        accent: '#c8a96e',
        'frame-bg': '#111111',
      },
    },
  },
  plugins: [],
}

export default config
