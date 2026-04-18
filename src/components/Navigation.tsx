'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef } from 'react'
import { NAV_ITEMS, type NavItem } from '@/lib/nav-data'

function isActive(href: string | null, pathname: string): boolean {
  if (!href) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

function DropdownItem({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname()
  const active = isActive(item.href, pathname)
  const hasChildren = (item.children?.length ?? 0) > 0

  if (!hasChildren) {
    return (
      <li>
        {item.href ? (
          <Link href={item.href} className={active ? 'nav-current' : ''}>
            {item.label}
          </Link>
        ) : (
          <span className="nav-current">{item.label}</span>
        )}
      </li>
    )
  }

  return (
    <li className="has-dropdown">
      {item.href ? (
        <Link href={item.href} className={active ? 'nav-current' : ''}>
          {item.label}
        </Link>
      ) : (
        <span className="nav-current">{item.label}</span>
      )}
      <ul>
        {item.children!.map((child, i) => (
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
  const liRef = useRef<HTMLLIElement>(null)

  return (
    <li
      ref={liRef}
      className={hasChildren ? 'has-dropdown' : ''}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {item.href ? (
        <Link href={item.href} className={active ? 'nav-current' : ''}>
          {item.label}
        </Link>
      ) : (
        <span className="nav-current">{item.label}</span>
      )}

      {hasChildren && open && (
        <ul style={{ display: 'block' }}>
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
    <div id="nav-container">
      <nav id="nav-bar" aria-label="Site navigation">
        <ul>
          {NAV_ITEMS.map((item, i) => (
            <TopNavItem key={i} item={item} />
          ))}
        </ul>
      </nav>
    </div>
  )
}
