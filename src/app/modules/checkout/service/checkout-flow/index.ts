import type { FrontendEventBus } from '@/shared/frontend-events'
import { bus as defaultBus, getLast } from '@/shared/frontend-events'

function belongsToCurrentCheckout(checkoutId: string): boolean {
  const current = getLast('checkout.started')
  return current?.payload.checkoutId === checkoutId
}

export function registerCheckout(eventBus: FrontendEventBus) {
  const onPaymentSucceeded = ({ checkoutId }: { checkoutId: string }) => {
    if (!belongsToCurrentCheckout(checkoutId)) {
      return
    }

    eventBus.emit('checkout.completed', { checkoutId })
  }

  eventBus.on('payment.succeeded', onPaymentSucceeded)

  return () => {
    eventBus.off('payment.succeeded', onPaymentSucceeded)
  }
}

export function confirmCheckout(eventBus: FrontendEventBus = defaultBus): boolean {
  const checkoutId = `chk-${crypto.randomUUID()}`

  eventBus.emit('checkout.started', { checkoutId })
  eventBus.emit('payment.requested', { checkoutId })

  return true
}
