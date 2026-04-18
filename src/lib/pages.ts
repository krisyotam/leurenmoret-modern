/**
 * pages.ts — re-exports from content.ts for backward compatibility.
 * All content is now Markdown (.md) with YAML frontmatter.
 */
export type { Page as PageData } from './content'
export {
  getPage,
  getIndexPage,
  getContactPage,
  getGlossaryPage,
  getSectionIndex,
  getSectionPage,
  getSectionSlugs,
  getAllPaths,
  SECTIONS,
} from './content'
export type { Section } from './content'
