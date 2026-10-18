import { pickLatest, useListen } from '@/shared/frontend-events'

export function useOrdersPage() {
  const started = useListen('checkout.started')
  const succeeded = useListen('payment.succeeded')
  const failed = useListen('payment.failed')
  const completed = useListen('checkout.completed')
  const current = pickLatest(started, succeeded, failed, completed)

  const checkoutId = started?.payload.checkoutId
  const sameCheckout = (id?: string) => Boolean(checkoutId && id === checkoutId)

  let status: 'nenhum' | 'aguardando' | 'pago' | 'falhou' = 'nenhum'
  if (started && current === started) {
    status = 'aguardando'
  }
  if (succeeded && current === succeeded && sameCheckout(succeeded.payload.checkoutId)) {
    status = 'pago'
  }
  if (completed && current === completed && sameCheckout(completed.payload.checkoutId)) {
    status = 'pago'
  }
  if (failed && current === failed && sameCheckout(failed.payload.checkoutId)) {
    status = 'falhou'
  }

  return {
    checkoutId,
    status,
    paymentId:
      succeeded && sameCheckout(succeeded.payload.checkoutId)
        ? succeeded.payload.paymentId
        : undefined,
    reason:
      failed && sameCheckout(failed.payload.checkoutId)
        ? failed.payload.reason
        : undefined,
  }
}
