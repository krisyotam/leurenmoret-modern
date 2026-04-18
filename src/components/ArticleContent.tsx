interface ArticleContentProps {
  html: string
  title?: string
}

export default function ArticleContent({ html, title }: ArticleContentProps) {
  return (
    <div id="main">
      {title && <h1>{title}</h1>}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
