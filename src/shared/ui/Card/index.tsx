import type { ReactNode } from 'react'
import { cardClass } from '../classes'

type CardProps = {
  children: ReactNode
  as?: 'article' | 'aside' | 'div' | 'li'
  className?: string
}

export function Card({ children, as: Tag = 'article', className }: CardProps) {
  return <Tag className={className ? `${cardClass} ${className}` : cardClass}>{children}</Tag>
}
