import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logoLink}>
          <span className={styles.atom} aria-hidden="true">⚛</span>
          <div className={styles.titles}>
            <span className={styles.siteName}>Leuren Moret: Global Nuclear Coverup</span>
            <span className={styles.tagline}>
              Assembled works of Leuren Moret, BS, MS, PhD ABD — geoscientist &amp; nuclear whistleblower
            </span>
          </div>
          <span className={styles.atom} aria-hidden="true">⚛</span>
        </Link>
      </div>
    </header>
  )
}
