import { useMutation } from '@tanstack/react-query'
import { succeedSimulatedPayment } from '../../service/simulated-payment'

export function useMutationSucceedPayment() {
  return useMutation({
    mutationFn: async () => succeedSimulatedPayment(),
  })
}
