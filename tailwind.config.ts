import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'lm-navy':  '#002342',
        'lm-cream': '#ffefe0',
        'lm-peach': '#ffe0cb',
        'lm-mauve': '#4e3f49',
        'lm-gray':  '#666666',
        'lm-link':  '#000000',
      },
      fontFamily: {
        body: ['"Lucida Grande"', 'Helvetica', 'Verdana', 'sans-serif'],
      },
      maxWidth: {
        page: '760px',
      },
    },
  },
  plugins: [typography],
}

export default config
