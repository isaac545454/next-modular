'use client'

import { StatusMessage } from '@/shared/ui/StatusMessage'
import { TextLink } from '@/shared/ui/TextLink'

type CheckoutStatusProps = {
  userId: string | null
  awaitingPayment: boolean
  completed: boolean
  failedCheckout: boolean
  checkoutId?: string
  failureReason?: string
}

export function CheckoutStatus({
  userId,
  awaitingPayment,
  completed,
  failedCheckout,
  checkoutId,
  failureReason,
}: CheckoutStatusProps) {
  return (
    <>
      {!userId ? (
        <StatusMessage>
          Autentique-se para confirmar o checkout.{' '}
          <TextLink to="/login">Ir para o login</TextLink>
        </StatusMessage>
      ) : null}
      {completed && checkoutId ? (
        <StatusMessage tone="success">
          Checkout {checkoutId} concluído.{' '}
          <TextLink to="/payment/recibo">Ver recibo</TextLink>
        </StatusMessage>
      ) : null}
      {failedCheckout && failureReason ? (
        <StatusMessage tone="error">{failureReason}</StatusMessage>
      ) : null}
      {awaitingPayment && checkoutId ? (
        <StatusMessage>Aguardando pagamento do checkout {checkoutId}.</StatusMessage>
      ) : null}
    </>
  )
}
