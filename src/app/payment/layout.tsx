import { PaymentLayout } from '@/modules/payment/layouts/PaymentLayout'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <PaymentLayout>{children}</PaymentLayout>
}
