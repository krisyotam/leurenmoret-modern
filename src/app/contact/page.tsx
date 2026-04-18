import type { Metadata } from 'next'
import { getContactPage } from '@/lib/content'
import ArticlePage from '@/components/ArticlePage'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  const page = getContactPage()
  if (!page) return <div className="page-error">Contact page not found.</div>
  return <ArticlePage page={page} />
}
