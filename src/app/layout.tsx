import type { Metadata } from 'next'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import './globals.css'

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
    <html lang="en">
      <body>
        <div id="page">
          <Header />
          <Navigation />
          <main id="main-content">
            {children}
          </main>
          <footer id="footer">
            <p>
              Content &copy; Leuren Moret &amp; Laurens L. Battis III &mdash; all rights reserved.
              Snapshot 2026 via{' '}
              <a href="https://cdn.krisyotam.com" target="_blank" rel="noreferrer">
                STARGATE
              </a>{' '}
              by{' '}
              <a href="https://krisyotam.com" target="_blank" rel="noreferrer">
                krisyotam
              </a>.
            </p>
          </footer>
        </div>
      </body>
    </html>
  )
}
