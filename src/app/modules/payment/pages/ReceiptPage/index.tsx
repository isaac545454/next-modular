'use client'

import { StatusMessage } from '@/shared/ui/StatusMessage'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { TextLink } from '@/shared/ui/TextLink'
import { ReceiptDetails } from '../../components/ReceiptDetails'
import { useReceiptPage } from './useReceiptPage'

export function ReceiptPage() {
  const { receipt } = useReceiptPage()

  return (
    <PageSection>
      <PageHeader
        kicker="Módulo payment"
        title="Recibo"
        description="O recibo lê payment.succeeded no bus. Checkout conclui o pedido no mesmo evento, sem importar este módulo."
      />
      {receipt ? (
        <ReceiptDetails paymentId={receipt.paymentId} checkoutId={receipt.checkoutId} />
      ) : (
        <StatusMessage tone="empty">
          Nenhum pagamento confirmado ainda. Confirme um checkout e use o sandbox.
        </StatusMessage>
      )}
      <TextLink to="/payment">Voltar à cobrança</TextLink>
    </PageSection>
  )
}
