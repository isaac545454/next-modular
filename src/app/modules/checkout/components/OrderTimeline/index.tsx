'use client'

import { Card } from '@/shared/ui/Card'
import { DefinitionList } from '@/shared/ui/DefinitionList'
import { subtitleClass } from '@/shared/ui/classes'

type OrderTimelineProps = {
  checkoutId?: string
  status: 'nenhum' | 'aguardando' | 'pago' | 'falhou'
  paymentId?: string
  reason?: string
}

const statusLabel: Record<OrderTimelineProps['status'], string> = {
  nenhum: 'Sem pedido neste navegador',
  aguardando: 'Aguardando payment.succeeded',
  pago: 'Pago — checkout.completed emitido',
  falhou: 'Pagamento recusado',
}

export function OrderTimeline({ checkoutId, status, paymentId, reason }: OrderTimelineProps) {
  return (
    <Card>
      <h2 className={subtitleClass}>Último pedido</h2>
      <DefinitionList
        items={[
          { term: 'checkoutId', description: checkoutId ?? '—' },
          { term: 'status', description: statusLabel[status] },
          { term: 'paymentId', description: paymentId ?? '—' },
          { term: 'motivo', description: reason ?? '—' },
        ]}
      />
    </Card>
  )
}
