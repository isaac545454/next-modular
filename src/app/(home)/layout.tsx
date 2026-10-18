import { HomeLayout } from '@/modules/home/layouts/HomeLayout'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout>{children}</HomeLayout>
}
