'use client'

import { Card } from '@/shared/ui/Card'
import { DefinitionList } from '@/shared/ui/DefinitionList'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { subtitleClass } from '@/shared/ui/classes'

export function SessionGuidePage() {
  return (
    <PageSection>
      <PageHeader
        kicker="Módulo auth"
        title="Sessão"
        description="O token de autenticação nunca entra em sessionStorage, localStorage ou document.cookie. Só o userId fica na memória."
      />
      <h2 className={subtitleClass}>Onde mora cada pedaço</h2>
      <Card>
        <DefinitionList
          items={[
            { term: 'Cookie tlc_session', description: 'HttpOnly, Path=/, SameSite=Lax' },
            { term: 'shared/session', description: '{ userId } em memória' },
            { term: 'Bus', description: 'auth.signedIn e auth.signedOut' },
            { term: 'Hydrate', description: 'GET /api/auth/session + seed, sem emit' },
          ]}
        />
      </Card>
    </PageSection>
  )
}
