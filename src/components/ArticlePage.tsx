import type { Page } from '@/lib/content'
import ArticleContent from './ArticleContent'
import Sidebar from './Sidebar'
import SharedSidebar from './SharedSidebar'

interface Props {
  page: Page
}

export default function ArticlePage({ page }: Props) {
  return (
    <div id="page-content" className="cf">
      {page.sidebarHtml ? <Sidebar html={page.sidebarHtml} /> : <SharedSidebar />}
      <ArticleContent html={page.html} title={page.title} />
    </div>
  )
}
