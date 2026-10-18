'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { authNav, logout } from '@/modules/auth'
import { checkoutNav } from '@/modules/checkout'
import { homeNav } from '@/modules/home'
import { paymentNav } from '@/modules/payment'
import { useSignedInUserId } from '@/shared/frontend-events'
import { ghostButtonClass } from '@/shared/ui/classes'
import { EventInspector } from '../EventInspector'

const appNav = [...homeNav, ...authNav, ...checkoutNav, ...paymentNav]

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

type AppLayoutProps = {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const userId = useSignedInUserId()
  const navItems = userId
    ? appNav.filter((item) => item.path !== '/login')
    : appNav

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-tlc-surface font-sans text-tlc-text">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-tlc-purple bg-tlc-dark px-6 py-4 text-white">
        <p className="text-[1.05rem] tracking-wide text-white">
          <span className="mr-2 text-tlc-purple">◆</span>
          Curso Frontend TLC
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex flex-wrap gap-3" aria-label="Principal">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={[
                  'rounded-tlc px-3 py-1.5 text-white no-underline',
                  isActivePath(pathname, item.path)
                    ? 'bg-tlc-blue'
                    : 'hover:bg-tlc-blue-dark',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {userId ? (
            <div className="flex items-center gap-2 rounded-tlc bg-white/10 px-2 py-1">
              <span className="px-1 text-sm text-tlc-success-soft">{userId}</span>
              <button
                type="button"
                className={ghostButtonClass}
                onClick={() => void logout()}
              >
                Sair
              </button>
            </div>
          ) : null}
        </div>
      </header>
      <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main>{children}</main>
        <EventInspector />
      </div>
      <footer className="border-t border-tlc-muted/40 bg-white px-6 py-4 text-sm text-tlc-text">
        <p className="m-0 mx-auto w-[min(1180px,100%)]">
          Monolito modular · módulos se falam só por eventos · rotas entram pelo{' '}
          <code className="rounded-tlc bg-tlc-surface-muted px-1.5 py-0.5 text-tlc-navy">
            App Router
          </code>
          .
        </p>
      </footer>
    </div>
  )
}
