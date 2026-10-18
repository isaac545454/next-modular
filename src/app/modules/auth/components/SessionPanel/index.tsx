'use client'

import { StatusMessage } from '@/shared/ui/StatusMessage'
import { Button } from '@/shared/ui/Button'
import { hintClass } from '@/shared/ui/classes'
import { useSessionPanel } from './useSessionPanel'

type SessionPanelProps = {
  userId: string
}

export function SessionPanel({ userId }: SessionPanelProps) {
  const { logout, pending } = useSessionPanel()

  return (
    <div className="grid gap-3">
      <StatusMessage tone="success">Autenticado como {userId}.</StatusMessage>
      <p className={hintClass}>
        A sessão em memória tem só <code>userId</code>. O token vive no cookie{' '}
        <code>tlc_session</code> e o JavaScript não lê o valor.
      </p>
      <Button onClick={logout} disabled={pending}>
        Sair
      </Button>
    </div>
  )
}
