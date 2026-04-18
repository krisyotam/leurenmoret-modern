/**
 * content.ts — Content loader for the Leuren Moret archive.
 *
 * Reads Markdown files with YAML frontmatter from content/**\/*.md
 * (extracted by scripts/extract_content.py using html2text + gray-matter).
 * Renders Markdown to HTML with `marked`.
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

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

export function getPage(pathStr: string): Page | null {
  return readMd(path.join(CONTENT_DIR, `${pathStr}.md`))
}

export function getIndexPage(): Page | null   { return getPage('index') }
export function getContactPage(): Page | null  { return getPage('contact') }
export function getGlossaryPage(): Page | null { return getPage('glossary') }

export function getSectionIndex(section: string): Page | null {
  return getPage(`${section}/index`)
}

export function getSectionPage(section: string, slug: string): Page | null {
  return getPage(`${section}/${slug}`)
}

function collectMdPaths(dir: string, base = ''): string[] {
  if (!fs.existsSync(dir)) return []
  const results: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      results.push(...collectMdPaths(path.join(dir, entry.name), rel))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(rel.replace(/\.md$/, ''))
    }
  }
  return results
}

export function getSectionSlugs(section: string): string[] {
  return collectMdPaths(path.join(CONTENT_DIR, section)).filter(p => p !== 'index')
}

export function getAllPaths(): string[] {
  return collectMdPaths(CONTENT_DIR)
}

export const SECTIONS = ['archive', 'currents', 'waves', 'lifestyle'] as const
export type Section = typeof SECTIONS[number]
