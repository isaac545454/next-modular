import { useMutation } from '@tanstack/react-query'
import { failSimulatedPayment } from '../../service/simulated-payment'

export function useMutationFailPayment() {
  return useMutation({
    mutationFn: async () => failSimulatedPayment(),
  })
}
