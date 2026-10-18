'use client'

import { Badge } from '@/shared/ui/Badge'
import { BulletList } from '@/shared/ui/BulletList'
import { Card } from '@/shared/ui/Card'
import { checkoutOffer } from '../../service/offer'

type OfferSummaryProps = {
  compact?: boolean
}

export function OfferSummary({ compact = false }: OfferSummaryProps) {
  return (
    <Card>
      <Badge>{checkoutOffer.sku}</Badge>
      <h2 className="m-0 text-lg font-semibold text-tlc-navy">{checkoutOffer.title}</h2>
      <p className="m-0 text-sm">{checkoutOffer.subtitle}</p>
      <p className="m-0 text-2xl font-semibold text-tlc-navy">{checkoutOffer.priceLabel}</p>
      <p className="m-0 text-sm font-semibold text-tlc-navy">Inclui</p>
      <BulletList items={checkoutOffer.includes} />
      {compact ? null : (
        <>
          <p className="m-0 text-sm font-semibold text-tlc-navy">Programa</p>
          <BulletList items={checkoutOffer.syllabus} />
        </>
      )}
    </Card>
  )
}
