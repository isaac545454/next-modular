'use client'

import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { TextLink } from '@/shared/ui/TextLink'
import { OrderTimeline } from '../../components/OrderTimeline'
import { useOrdersPage } from './useOrdersPage'

export function OrdersPage() {
  const { checkoutId, status, paymentId, reason } = useOrdersPage()

  return (
    <PageSection>
      <PageHeader
        kicker="Módulo checkout"
        title="Histórico"
        description="O histórico lê o último payload do bus. Não há store compartilhada entre módulos."
      />
      <OrderTimeline
        checkoutId={checkoutId}
        status={status}
        paymentId={paymentId}
        reason={reason}
      />
      <TextLink to="/checkout">Voltar ao pedido</TextLink>
    </PageSection>
  )
}
