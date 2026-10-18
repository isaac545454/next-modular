'use client'

import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { Button } from '@/shared/ui/Button'
import { CheckoutStatus } from '../../components/CheckoutStatus'
import { OfferSummary } from '../../components/OfferSummary'
import { useCheckoutPage } from './useCheckoutPage'

export function CheckoutPage() {
  const {
    userId,
    awaitingPayment,
    completed,
    failedCheckout,
    checkoutId,
    failureReason,
    canConfirm,
    confirm,
  } = useCheckoutPage()

  return (
    <PageSection>
      <PageHeader
        kicker="Pedido simulado"
        title="Checkout"
        description={
          <>
            Confirmar emite <code>checkout.started</code> e{' '}
            <code>payment.requested</code>. O módulo não importa payment.
          </>
        }
      />
      <OfferSummary compact />
      <CheckoutStatus
        userId={userId}
        awaitingPayment={awaitingPayment}
        completed={completed}
        failedCheckout={failedCheckout}
        checkoutId={checkoutId}
        failureReason={failureReason}
      />
      <Button disabled={!canConfirm} onClick={confirm}>
        Confirmar checkout
      </Button>
    </PageSection>
  )
}
