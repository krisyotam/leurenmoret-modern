import type { Page } from '@/lib/content'
import ArticleContent from './ArticleContent'
import Sidebar from './Sidebar'
import styles from './ArticlePage.module.css'

interface Props {
  page: Page
}

export default function ArticlePage({ page }: Props) {
  return (
    <div className={styles.layout}>
      <ArticleContent html={page.html} title={page.title} />
      {page.sidebarHtml && <Sidebar html={page.sidebarHtml} />}
    </div>
  )
}
