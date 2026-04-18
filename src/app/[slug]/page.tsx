import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug, getAllSlugs } from '@/lib/content'
import ArticlePage from '@/components/ArticlePage'

interface Props {
  params: Promise<{ slug: string }>
}

// Skip special top-level slugs that have their own static routes
const STATIC_SLUGS = new Set(['index', 'contact', 'glossary'])

export async function generateStaticParams() {
  return getAllSlugs()
    .filter(slug => !STATIC_SLUGS.has(slug))
    .map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getPageBySlug(slug)
  if (!page) return { title: 'Not Found' }
  return {
    title: page.title,
    description: page.description,
  }
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const page = getPageBySlug(slug)
  if (!page) notFound()
  return <ArticlePage page={page} />
}
