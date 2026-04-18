interface SidebarProps {
  html: string
}

export default function Sidebar({ html }: SidebarProps) {
  if (!html || !html.trim()) return null

  return (
    <div id="sidebar-container">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
