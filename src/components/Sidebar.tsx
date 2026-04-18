import styles from './Sidebar.module.css'

interface SidebarProps {
  html: string
}

export default function Sidebar({ html }: SidebarProps) {
  if (!html || !html.trim()) return null

  return (
    <aside className={styles.sidebar}>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </aside>
  )
}
