'use client'

import { StatusMessage } from '@/shared/ui/StatusMessage'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { PaymentActions } from '../../components/PaymentActions'
import { SimulatedCard } from '../../components/SimulatedCard'
import { usePaymentPage } from './usePaymentPage'

export function PaymentPage() {
  const { pendingCheckoutId } = usePaymentPage()

  return (
    <PageSection>
      <PageHeader
        kicker="PSP sandbox"
        title="Pagamento"
        description={
          <>
            Este módulo só escuta <code>payment.requested</code> e publica o resultado.
            Não há import de checkout.
          </>
        }
      />
      {pendingCheckoutId ? (
        <>
          <SimulatedCard />
          <StatusMessage>
            Pagamento simulado pendente para o checkout {pendingCheckoutId}.
          </StatusMessage>
          <PaymentActions />
        </>
      ) : (
        <StatusMessage tone="empty">
          Nenhum pagamento solicitado. Confirme um checkout para iniciar.
        </StatusMessage>
      )}
    </PageSection>
  )
}
