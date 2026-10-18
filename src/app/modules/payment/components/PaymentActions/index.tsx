'use client'

import { Button } from '@/shared/ui/Button'
import { usePaymentActions } from './usePaymentActions'

export function PaymentActions() {
  const { succeed, fail } = usePaymentActions()

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="success" onClick={succeed}>
        Confirmar pagamento
      </Button>
      <Button variant="danger" onClick={fail}>
        Simular falha
      </Button>
    </div>
  )
}
