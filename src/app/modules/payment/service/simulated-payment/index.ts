import type { FrontendEventBus } from '@/shared/frontend-events'
import { bus as defaultBus, getLast, pickLatest } from '@/shared/frontend-events'

function pendingCheckoutId(): string | null {
  const requested = getLast('payment.requested')
  const succeeded = getLast('payment.succeeded')
  const failed = getLast('payment.failed')
  if (!requested || pickLatest(requested, succeeded, failed) !== requested) {
    return null
  }
  return requested.payload.checkoutId
}

export function succeedSimulatedPayment(
  eventBus: FrontendEventBus = defaultBus,
): boolean {
  const checkoutId = pendingCheckoutId()
  if (!checkoutId) {
    return false
  }

  eventBus.emit('payment.succeeded', {
    paymentId: `pay-${checkoutId}`,
    checkoutId,
  })
  return true
}

export function failSimulatedPayment(
  reason = 'Pagamento recusado na simulação',
  eventBus: FrontendEventBus = defaultBus,
): boolean {
  const checkoutId = pendingCheckoutId()
  if (!checkoutId) {
    return false
  }

  eventBus.emit('payment.failed', { checkoutId, reason })
  return true
}
