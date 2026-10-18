import { useMutationFailPayment } from '../../query/useMutationFailPayment'
import { useMutationSucceedPayment } from '../../query/useMutationSucceedPayment'

export function usePaymentActions() {
  const succeedMutation = useMutationSucceedPayment()
  const failMutation = useMutationFailPayment()

  return {
    succeed: () => {
      succeedMutation.mutate()
    },
    fail: () => {
      failMutation.mutate()
    },
  }
}
