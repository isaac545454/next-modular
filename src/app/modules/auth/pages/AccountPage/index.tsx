'use client'

import { StatusMessage } from '@/shared/ui/StatusMessage'
import { DefinitionList } from '@/shared/ui/DefinitionList'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { TextLink } from '@/shared/ui/TextLink'
import { SessionPanel } from '../../components/SessionPanel'
import { useAccountPage } from './useAccountPage'

export function AccountPage() {
  const { userId, simulatedEmail, simulatedUserId } = useAccountPage()

  if (!userId) {
    return (
      <PageSection>
        <PageHeader
          kicker="Módulo auth"
          title="Conta"
          description="A conta só existe depois de auth.signedIn. Este módulo não lê cookie no JavaScript."
        />
        <StatusMessage>
          Entre para ver a sessão em memória.{' '}
          <TextLink to="/login">Ir para o login</TextLink>
        </StatusMessage>
      </PageSection>
    )
  }

  return (
    <PageSection>
      <PageHeader kicker="Módulo auth" title="Conta" />
      <DefinitionList
        items={[
          { term: 'userId', description: userId },
          { term: 'e-mail simulado', description: simulatedEmail },
          { term: 'identidade padrão', description: simulatedUserId },
        ]}
      />
      <SessionPanel userId={userId} />
    </PageSection>
  )
}
