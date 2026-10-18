import { useMutation } from '@tanstack/react-query'
import { confirmCheckout } from '../../service/checkout-flow'

export function useMutationConfirmCheckout() {
  return useMutation({
    mutationFn: async () => confirmCheckout(),
  })
}
