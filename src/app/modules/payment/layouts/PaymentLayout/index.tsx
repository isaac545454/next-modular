'use client'

import type { ReactNode } from 'react'
import { ModuleSubnav } from '@/shared/ui/ModuleSubnav'

const paymentSubnav = [
  { label: 'Cobrança', path: '/payment', end: true },
  { label: 'Recibo', path: '/payment/recibo' },
  { label: 'Sandbox', path: '/payment/sandbox' },
] as const

export function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4">
      <ModuleSubnav label="Módulo payment" items={paymentSubnav} />
      {children}
    </div>
  )
}
