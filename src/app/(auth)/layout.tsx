import { AuthLayout } from '@/modules/auth/layouts/AuthLayout'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}
