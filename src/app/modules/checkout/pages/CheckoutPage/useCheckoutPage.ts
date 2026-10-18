import {
  pickLatest,
  useListen,
  useSignedInUserId,
} from '@/shared/frontend-events'
import { useMutationConfirmCheckout } from '../../query/useMutationConfirmCheckout'

export function useCheckoutPage() {
  const userId = useSignedInUserId()
  const started = useListen('checkout.started')
  const succeeded = useListen('payment.succeeded')
  const failed = useListen('payment.failed')
  const current = pickLatest(started, succeeded, failed)
  const confirmMutation = useMutationConfirmCheckout()

  const awaitingPayment = Boolean(started) && current === started
  const completed =
    Boolean(succeeded) &&
    current === succeeded &&
    started?.payload.checkoutId === succeeded?.payload.checkoutId
  const failedCheckout =
    Boolean(failed) &&
    current === failed &&
    started?.payload.checkoutId === failed?.payload.checkoutId

  return {
    userId,
    awaitingPayment,
    completed,
    failedCheckout,
    checkoutId: started?.payload.checkoutId,
    failureReason: failed?.payload.reason,
    canConfirm: Boolean(userId) && !awaitingPayment,
    confirm: () => {
      confirmMutation.mutate()
    },
  }
}
