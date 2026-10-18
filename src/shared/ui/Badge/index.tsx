import type { ReactNode } from 'react'
import { badgeClass } from '../classes'

type BadgeProps = {
  children: ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return <p className={className ? `${badgeClass} ${className}` : badgeClass}>{children}</p>
}
