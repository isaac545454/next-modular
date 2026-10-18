import type { ReactNode } from 'react'
import { pageClass } from '../classes'

type PageSectionProps = {
  children: ReactNode
  className?: string
}

export function PageSection({ children, className }: PageSectionProps) {
  return (
    <section className={className ? `${pageClass} ${className}` : pageClass}>{children}</section>
  )
}
