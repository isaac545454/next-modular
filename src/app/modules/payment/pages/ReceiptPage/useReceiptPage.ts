import { pickLatest, useListen } from '@/shared/frontend-events'

export function useReceiptPage() {
  const succeeded = useListen('payment.succeeded')
  const failed = useListen('payment.failed')
  const latest = pickLatest(succeeded, failed)
  const receipt =
    succeeded && latest === succeeded ? succeeded.payload : null

  return { receipt }
}
