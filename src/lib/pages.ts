/**
 * pages.ts — re-exports from content.ts for backward compatibility.
 * All content is now Markdown (.md) with YAML frontmatter, addressed by flat slug.
 */
export type { Page as PageData } from './content'
export {
  getPage,
  getPageBySlug,
  getAllSlugs,
  getIndexPage,
  getContactPage,
  getGlossaryPage,
  SECTIONS,
} from './content'
export type { Section } from './content'
