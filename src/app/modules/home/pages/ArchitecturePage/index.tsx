'use client'

import { hintClass, subtitleClass } from '@/shared/ui/classes'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { ArchitectureFaq } from '../../components/ArchitectureFaq'
import { ArchitectureMap } from '../../components/ArchitectureMap'

export function ArchitecturePage() {
  return (
    <PageSection>
      <PageHeader
        kicker="Módulo home"
        title="Arquitetura"
        description="O mapa abaixo é o contrato do exemplo: quem emite, quem escuta e o que o shell faz com o mesmo catálogo."
      />
      <h2 className={subtitleClass}>Módulos</h2>
      <p className={hintClass}>
        Features não se importam. Rotas entram pelo App Router em <code>src/app</code>.
        Eventos entram pelo bus. O painel à direita só observa.
      </p>
      <ArchitectureMap />
      <ArchitectureFaq />
    </PageSection>
  )
}
