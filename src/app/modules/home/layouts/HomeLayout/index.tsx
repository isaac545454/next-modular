'use client'

import type { ReactNode } from 'react'
import { ModuleSubnav } from '@/shared/ui/ModuleSubnav'

const homeSubnav = [
  { label: 'Catálogo', path: '/', end: true },
  { label: 'Arquitetura', path: '/arquitetura' },
] as const

export function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4">
      <ModuleSubnav label="Módulo home" items={homeSubnav} />
      {children}
    </div>
  )
}
