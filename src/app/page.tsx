import type { Metadata } from 'next'
import { getIndexPage } from '@/lib/content'
import ArticlePage from '@/components/ArticlePage'

export const metadata: Metadata = {
  title: 'Leuren Moret: Global Nuclear Coverup',
  description:
    'Assembled works of Leuren Moret — geoscientist, nuclear whistleblower, and independent radiation researcher.',
}

export default function HomePage() {
  const page = getIndexPage()
  if (!page) return <div className="page-error">Index page not found.</div>
  return <ArticlePage page={page} />
}
