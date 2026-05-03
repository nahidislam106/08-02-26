import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vs-bg': '#1e1e1e',
        'vs-sidebar': '#252526',
        'vs-panel': '#2d2d30',
        'vs-text': '#d4d4d4',
        'vs-accent': '#569cd6',
      },
    },
  },
  plugins: [],
}
export default config
