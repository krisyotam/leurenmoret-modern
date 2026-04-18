import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSectionPage, getSectionIndex, getSectionSlugs, SECTIONS } from '@/lib/content'
import ArticlePage from '@/components/ArticlePage'

interface Props {
  params: Promise<{ section: string; slug?: string[] }>
}

// Generate every static path at build time.
export async function generateStaticParams() {
  const params: { section: string; slug?: string[] }[] = []

  for (const section of SECTIONS) {
    // Section index: /section  (no slug)
    params.push({ section, slug: undefined })

    // All sub-pages
    const slugs = getSectionSlugs(section)
    for (const slug of slugs) {
      // slug may be "leuren-moret-hiroshima" or "donetsk-nuclear-explosion/index"
      const parts = slug.split('/')
      params.push({ section, slug: parts })
    }
  }

  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params
  const slugStr = slug?.join('/') ?? 'index'
  const page = slug?.length
    ? getSectionPage(section, slugStr)
    : getSectionIndex(section)
  if (!page) return { title: 'Not Found' }
  return {
    title: page.title,
    description: page.description,
  }
}

export default async function SectionPage({ params }: Props) {
  const { section, slug } = await params

  if (!SECTIONS.includes(section as typeof SECTIONS[number])) notFound()

  const slugStr = slug?.join('/') ?? 'index'
  const page = slug?.length
    ? getSectionPage(section, slugStr)
    : getSectionIndex(section)

  if (!page) notFound()

  return <ArticlePage page={page} />
}
