import type { ReactNode } from 'react'

type Tone = 'info' | 'error' | 'success' | 'empty' | 'loading'

type StatusMessageProps = {
  tone?: Tone
  children: ReactNode
}

const toneClass: Record<Tone, string> = {
  info: 'bg-tlc-blue/10 text-tlc-navy',
  error: 'bg-tlc-error-soft text-tlc-error',
  success: 'bg-tlc-success-soft/30 text-tlc-navy',
  empty: 'bg-tlc-surface-muted text-tlc-text',
  loading: 'bg-tlc-blue-soft/15 text-tlc-blue-dark',
}

export function StatusMessage({ tone = 'info', children }: StatusMessageProps) {
  return (
    <p
      className={`m-0 rounded-tlc px-4 py-3.5 text-[0.95rem] leading-snug ${toneClass[tone]}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  )
}
