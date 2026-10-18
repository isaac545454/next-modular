'use client'

import { createContext, useContext } from 'react'

export type TestNavigation = {
  pathname: string
  push: (href: string) => void
}

export const TestNavContext = createContext<TestNavigation | null>(null)

function useNav() {
  const nav = useContext(TestNavContext)
  if (!nav) {
    throw new Error('TestNavContext ausente')
  }
  return nav
}

export function useRouter() {
  const nav = useNav()
  return {
    push: nav.push,
    replace: nav.push,
    prefetch: async () => undefined,
    back: () => undefined,
    forward: () => undefined,
    refresh: () => undefined,
  }
}

export function usePathname() {
  return useNav().pathname
}

export function useParams() {
  const pathname = usePathname()
  const match = /^\/cursos\/([^/]+)/.exec(pathname)
  return { courseId: match?.[1] }
}
