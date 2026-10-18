'use client'

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { useRouter } from './next-navigation'

type LinkProps = {
  href: string
  children?: ReactNode
  className?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export default function Link({
  href,
  children,
  className,
  onClick,
  ...rest
}: LinkProps) {
  const router = useRouter()

  return (
    <a
      {...rest}
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault()
        onClick?.(event)
        router.push(href)
      }}
    >
      {children}
    </a>
  )
}
