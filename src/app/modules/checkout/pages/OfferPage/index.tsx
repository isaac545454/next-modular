'use client'

import { DefinitionList } from '@/shared/ui/DefinitionList'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { TextLink } from '@/shared/ui/TextLink'
import { OfferSummary } from '../../components/OfferSummary'
import { useOfferPage } from './useOfferPage'

export function OfferPage() {
  const { offer } = useOfferPage()

  return (
    <PageSection>
      <PageHeader
        kicker="Módulo checkout"
        title="Oferta"
        description="A oferta mora neste módulo. Home tem o catálogo; payment não precisa conhecer o SKU."
      />
      <DefinitionList
        items={[
          { term: 'SKU', description: offer.sku },
          { term: 'Carga', description: offer.duration },
          { term: 'Público', description: offer.audience },
        ]}
      />
      <OfferSummary />
      <TextLink variant="button" to="/checkout">
        Voltar ao pedido
      </TextLink>
    </PageSection>
  )
}
