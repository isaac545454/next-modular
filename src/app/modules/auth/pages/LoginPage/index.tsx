'use client'

import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { AuthSteps } from '../../components/AuthSteps'
import { LoginForm } from '../../components/LoginForm'
import { SessionPanel } from '../../components/SessionPanel'
import { useLoginPage } from './useLoginPage'

export function LoginPage() {
  const { userId } = useLoginPage()

  if (userId) {
    return (
      <PageSection>
        <PageHeader kicker="Cookie HttpOnly" title="Sessão ativa" />
        <SessionPanel userId={userId} />
      </PageSection>
    )
  }

  return (
    <PageSection>
      <PageHeader
        kicker="Auth simulada"
        title="Entrar"
        description="Login fake — valores já preenchidos. O token vai em cookie HttpOnly."
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <LoginForm />
        <AuthSteps />
      </div>
    </PageSection>
  )
}
