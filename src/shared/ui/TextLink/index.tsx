import type { ReactNode } from 'react'
import Link from 'next/link'
import { linkClass, primaryButtonClass } from '../classes'

type TextLinkProps = {
  to: string
  children: ReactNode
  variant?: 'inline' | 'button'
}

export function TextLink({ to, children, variant = 'inline' }: TextLinkProps) {
  const className =
    variant === 'button' ? `${primaryButtonClass} no-underline` : linkClass

  return (
    <Link className={className} href={to}>
      {children}
    </Link>
  )
}
