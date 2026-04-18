/**
 * content.ts — Content loader for the Leuren Moret archive.
 *
 * Reads Markdown files with YAML frontmatter from content/**\/*.md
 * Pages are addressed by flat slug (Gwern-style) via slug-map.json.
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import slugMap from './slug-map.json'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export interface Page {
  title: string
  description?: string
  section: string
  slug: string
  path: string
  /** Rendered HTML of the article body */
  html: string
  /** Rendered HTML of the sidebar */
  sidebarHtml?: string
}

interface Frontmatter {
  title?: string
  description?: string
  section?: string
  slug?: string
  path?: string
  sidebar?: string
}

marked.setOptions({ gfm: true, breaks: false })

function readMd(filePath: string): Page | null {
  try {
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const fm = data as Frontmatter
    return {
      title: fm.title ?? 'Untitled',
      description: fm.description ?? undefined,
      section: fm.section ?? 'home',
      slug: fm.slug ?? '',
      path: fm.path ?? '',
      html: marked(content) as string,
      sidebarHtml: fm.sidebar ? (marked(fm.sidebar) as string) : undefined,
    }
  } catch {
    return null
  }
}

export function getPageBySlug(slug: string): Page | null {
  const relPath = slugMap[slug as keyof typeof slugMap]
  if (!relPath) return null
  return readMd(path.join(CONTENT_DIR, `${relPath}.md`))
}

export function getAllSlugs(): string[] {
  return Object.keys(slugMap)
}

// Convenience helpers used by the home, contact, and glossary pages
export function getIndexPage(): Page | null   { return getPageBySlug('index') }
export function getContactPage(): Page | null  { return getPageBySlug('contact') }
export function getGlossaryPage(): Page | null { return getPageBySlug('glossary') }

// Legacy helpers kept for backward compat (contact/glossary static routes)
export function getPage(pathStr: string): Page | null {
  return readMd(path.join(CONTENT_DIR, `${pathStr}.md`))
}

export const SECTIONS = ['archive', 'currents', 'waves', 'lifestyle'] as const
export type Section = typeof SECTIONS[number]
