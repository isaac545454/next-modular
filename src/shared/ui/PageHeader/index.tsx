import type { ReactNode } from 'react'
import { hintClass, kickerClass, titleClass } from '../classes'

type PageHeaderProps = {
  kicker?: string
  title: string
  description?: ReactNode
  children?: ReactNode
}

export function PageHeader({ kicker, title, description, children }: PageHeaderProps) {
  return (
    <div className="grid gap-2">
      {kicker ? <p className={kickerClass}>{kicker}</p> : null}
      <h1 className={titleClass}>{title}</h1>
      {description ? <p className={hintClass}>{description}</p> : null}
      {children}
    </div>
  )
}
