'use client'

import { BulletList } from '@/shared/ui/BulletList'
import { Card } from '@/shared/ui/Card'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { subtitleClass } from '@/shared/ui/classes'

const sandboxFacts = [
  'Não há Stripe, Pagarme nem backend de PSP',
  'Confirmar emite payment.succeeded com paymentId derivado do checkoutId',
  'Simular falha emite payment.failed com motivo seguro',
  'O shell escuta os dois eventos e redireciona',
]

export function SandboxPage() {
  return (
    <PageSection>
      <PageHeader
        kicker="Módulo payment"
        title="Sandbox"
        description="Esta página documenta o PSP de mentira. Serve para a aula, não para produção."
      />
      <h2 className={subtitleClass}>Regras da simulação</h2>
      <Card>
        <BulletList items={sandboxFacts} />
      </Card>
    </PageSection>
  )
}
