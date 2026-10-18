'use client'

import { Card } from '@/shared/ui/Card'
import { DefinitionList } from '@/shared/ui/DefinitionList'
import { subtitleClass } from '@/shared/ui/classes'
import { SIMULATED_AMOUNT } from '../../constants'

type ReceiptDetailsProps = {
  paymentId: string
  checkoutId: string
}

export function ReceiptDetails({ paymentId, checkoutId }: ReceiptDetailsProps) {
  return (
    <Card>
      <h2 className={subtitleClass}>Comprovante simulado</h2>
      <DefinitionList
        items={[
          { term: 'paymentId', description: paymentId },
          { term: 'checkoutId', description: checkoutId },
          { term: 'valor', description: SIMULATED_AMOUNT },
          { term: 'PSP', description: 'sandbox local — sem adquirente real' },
        ]}
      />
    </Card>
  )
}
