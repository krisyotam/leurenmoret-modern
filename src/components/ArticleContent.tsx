import styles from './ArticleContent.module.css'

interface ArticleContentProps {
  html: string
  title?: string
}

export default function ArticleContent({ html, title }: ArticleContentProps) {
  return (
    <article className={styles.article}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
