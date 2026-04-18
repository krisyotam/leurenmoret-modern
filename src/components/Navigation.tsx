'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { NAV_ITEMS, type NavItem } from '@/lib/nav-data'
import styles from './Navigation.module.css'

// Top-level nav items — we only show the top section items in the main nav bar.
// The full tree is available via NAV_ITEMS for future use.
const TOP_ITEMS: NavItem[] = NAV_ITEMS

function isActive(href: string | null, pathname: string): boolean {
  if (!href) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

function DropdownItem({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname()
  const active = isActive(item.href, pathname)

  if (!item.children || item.children.length === 0) {
    return (
      <li>
        {item.href ? (
          <Link
            href={item.href}
            className={`${styles.dropLink} ${active ? styles.dropLinkActive : ''}`}
            style={depth > 0 ? { paddingLeft: `${1 + depth * 0.75}rem` } : undefined}
          >
            {item.label}
          </Link>
        ) : (
          <span className={`${styles.dropLink} ${styles.dropLinkCurrent}`}>
            {item.label}
          </span>
        )}
      </li>
    )
  }

  return (
    <li className={styles.hasSubmenu}>
      {item.href ? (
        <Link
          href={item.href}
          className={`${styles.dropLink} ${active ? styles.dropLinkActive : ''}`}
          style={depth > 0 ? { paddingLeft: `${1 + depth * 0.75}rem` } : undefined}
        >
          {item.label}
        </Link>
      ) : (
        <span className={`${styles.dropLink} ${styles.dropLinkCurrent}`}>
          {item.label}
        </span>
      )}
      <ul className={styles.subMenu}>
        {item.children.map((child, i) => (
          <DropdownItem key={i} item={child} depth={depth + 1} />
        ))}
      </ul>
    </li>
  )
}

function TopNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const active = isActive(item.href, pathname)
  const hasChildren = (item.children?.length ?? 0) > 0

  return (
    <li
      className={`${styles.topItem} ${hasChildren ? styles.topItemHasChildren : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {item.href ? (
        <Link
          href={item.href}
          className={`${styles.topLink} ${active ? styles.topLinkActive : ''}`}
        >
          {item.label}
        </Link>
      ) : (
        <span className={`${styles.topLink} ${styles.topLinkCurrent}`}>
          {item.label}
        </span>
      )}

      {hasChildren && open && (
        <ul className={styles.dropMenu}>
          {item.children!.map((child, i) => (
            <DropdownItem key={i} item={child} depth={0} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Navigation() {
  return (
    <nav className={styles.nav} aria-label="Site navigation">
      <div className={styles.inner}>
        <ul className={styles.topList}>
          {TOP_ITEMS.map((item, i) => (
            <TopNavItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </nav>
  )
}
