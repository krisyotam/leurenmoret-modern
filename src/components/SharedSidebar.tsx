import Link from 'next/link'
import { NAV_ITEMS, type NavItem } from '@/lib/nav-data'

function NavTree({ items, depth = 0 }: { items: NavItem[]; depth?: number }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: depth === 0 ? 0 : '0 0 0 1em' }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: '0.2em' }}>
          {item.href ? (
            <Link href={item.href} style={{ color: '#002342', textDecoration: 'none', fontSize: '0.85em' }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: '#4e3f49', fontSize: '0.85em' }}>{item.label}</span>
          )}
          {item.children && item.children.length > 0 && (
            <NavTree items={item.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  )
}

export default function SharedSidebar() {
  return (
    <div id="sidebar-container">
      <div>
        <h4 style={{ color: '#002342', margin: '0 0 0.5em', fontSize: '0.9em', borderBottom: '1px solid #cbb89a', paddingBottom: '0.25em' }}>
          LMGNC Site Map
        </h4>
        <NavTree items={NAV_ITEMS} />
      </div>
    </div>
  )
}
