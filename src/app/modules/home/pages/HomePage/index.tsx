'use client'

import Link from 'next/link'
import { StatusMessage } from '@/shared/ui/StatusMessage'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { Button } from '@/shared/ui/Button'
import { TextLink } from '@/shared/ui/TextLink'
import { hintClass, subtitleClass } from '@/shared/ui/classes'
import { ArchitectureMap } from '../../components/ArchitectureMap'
import { HighlightGrid } from '../../components/HighlightGrid'
import { useHomePage } from './useHomePage'

export function HomePage() {
  const {
    userId,
    isPending,
    isError,
    isSuccess,
    highlights,
    errorMessage,
    refetch,
  } = useHomePage()

  return (
    <div className="grid gap-6">
      <PageSection>
        <PageHeader
          kicker="Exemplo de monolito modular"
          title="Home"
          description="Quatro módulos no App Router, um bus tipado e páginas de rota finas. Nada de importação cruzada entre features."
        />
        {userId ? (
          <StatusMessage tone="success">Olá, {userId}. Sessão autenticada.</StatusMessage>
        ) : (
          <StatusMessage>Visitante — entre para desbloquear o checkout.</StatusMessage>
        )}
        <div className="flex flex-wrap gap-3">
          {userId ? (
            <TextLink variant="button" to="/checkout">
              Ir ao checkout
            </TextLink>
          ) : (
            <TextLink variant="button" to="/login">
              Ir para o login
            </TextLink>
          )}
          <Link
            className="w-fit rounded-tlc bg-white px-4 py-2.5 text-tlc-navy no-underline shadow-tlc"
            href="/arquitetura"
          >
            Ver arquitetura
          </Link>
        </div>
      </PageSection>

      <PageSection>
        <h2 className={subtitleClass}>Destaques</h2>
        {isPending ? (
          <StatusMessage tone="loading">Carregando destaques…</StatusMessage>
        ) : null}
        {isError ? (
          <div className="grid justify-items-start gap-3">
            <StatusMessage tone="error">{errorMessage}</StatusMessage>
            <Button onClick={refetch}>Tentar novamente</Button>
          </div>
        ) : null}
        {isSuccess && highlights.length === 0 ? (
          <StatusMessage tone="empty">Nenhum destaque no momento.</StatusMessage>
        ) : null}
        {isSuccess && highlights.length > 0 ? (
          <HighlightGrid items={highlights} />
        ) : null}
      </PageSection>

      <PageSection>
        <h2 className={subtitleClass}>Como os módulos se falam</h2>
        <p className={hintClass}>
          Cada feature publica rotas e, quando precisa coordenar, emite um evento do
          catálogo. O ESLint bloqueia <code>@/modules/*</code> dentro de outro módulo.
        </p>
        <ArchitectureMap />
      </PageSection>
    </div>
  )
}
