'use client'

import type { ReactNode } from 'react'
import { ModuleSubnav } from '@/shared/ui/ModuleSubnav'

const authSubnav = [
  { label: 'Acessar', path: '/login' },
  { label: 'Conta', path: '/conta' },
  { label: 'Sessão', path: '/sessao' },
] as const

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4">
      <ModuleSubnav label="Módulo auth" items={authSubnav} />
      {children}
    </div>
  )
}
