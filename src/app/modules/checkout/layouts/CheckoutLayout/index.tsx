'use client'

import type { ReactNode } from 'react'
import { ModuleSubnav } from '@/shared/ui/ModuleSubnav'

const checkoutSubnav = [
  { label: 'Pedido', path: '/checkout', end: true },
  { label: 'Oferta', path: '/checkout/oferta' },
  { label: 'Histórico', path: '/checkout/pedidos' },
] as const

export function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4">
      <ModuleSubnav label="Módulo checkout" items={checkoutSubnav} />
      {children}
    </div>
  )
}
