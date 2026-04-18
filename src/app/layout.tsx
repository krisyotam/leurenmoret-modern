import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Leuren Moret: Global Nuclear Coverup',
    template: '%s | Leuren Moret: Global Nuclear Coverup',
  },
  description:
    'Assembled works of Leuren Moret — geoscientist, nuclear whistleblower, and independent radiation researcher. Archived mirror of leurenmoret.info.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lora.variable}>
      <body>
        <Header />
        <Navigation />
        <main id="main-content">
          {children}
        </main>
        <footer className="site-footer">
          <div className="footer-inner">
            <p>
              Content &copy; Leuren Moret &amp; Laurens L. Battis III — all rights reserved.
              Archive snapshot: November 2023.{' '}
              <a href="https://wayback.archive.org/web/*/leurenmoret.info" target="_blank" rel="noreferrer">
                Original via Wayback Machine
              </a>.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
