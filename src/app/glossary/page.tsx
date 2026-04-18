import type { Metadata } from 'next'
import { getGlossaryPage } from '@/lib/content'
import ArticlePage from '@/components/ArticlePage'

export const metadata: Metadata = {
  title: 'Glossary',
}

export default function GlossaryPage() {
  const page = getGlossaryPage()
  if (!page) return <div className="page-error">Glossary page not found.</div>
  return <ArticlePage page={page} />
}
