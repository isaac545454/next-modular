import { CheckoutLayout } from '@/modules/checkout/layouts/CheckoutLayout'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <CheckoutLayout>{children}</CheckoutLayout>
}
