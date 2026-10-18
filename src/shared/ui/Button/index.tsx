import type { ButtonHTMLAttributes } from 'react'
import {
  dangerButtonClass,
  primaryButtonClass,
  successButtonClass,
} from '../classes'

const variantClass = {
  primary: primaryButtonClass,
  success: successButtonClass,
  danger: dangerButtonClass,
} as const

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClass
}

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = className
    ? `${variantClass[variant]} ${className}`
    : variantClass[variant]

  return <button type={type} className={classes} {...props} />
}
