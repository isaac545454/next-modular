import { pickLatest, useListen } from '@/shared/frontend-events'

export function usePaymentPage() {
  const requested = useListen('payment.requested')
  const succeeded = useListen('payment.succeeded')
  const failed = useListen('payment.failed')
  const pendingCheckoutId =
    requested && pickLatest(requested, succeeded, failed) === requested
      ? requested.payload.checkoutId
      : null

  return { pendingCheckoutId }
}
