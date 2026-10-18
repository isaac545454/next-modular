'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type ModuleNavItem = {
  label: string
  path: string
  end?: boolean
}

type ModuleSubnavProps = {
  label: string
  items: readonly ModuleNavItem[]
}

function isActivePath(pathname: string, href: string, end?: boolean) {
  const exact = end ?? href.split('/').filter(Boolean).length <= 1
  if (exact) {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function ModuleSubnav({ label, items }: ModuleSubnavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={[
            'rounded-tlc px-3 py-1.5 text-sm no-underline',
            isActivePath(pathname, item.path, item.end)
              ? 'bg-tlc-blue text-white'
              : 'bg-white text-tlc-navy shadow-tlc hover:bg-tlc-surface-muted',
          ].join(' ')}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
