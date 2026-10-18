'use client'

import Link from 'next/link'
import type { Highlight } from '../../service/highlights'
import { Badge } from '@/shared/ui/Badge'
import { Card } from '@/shared/ui/Card'

type HighlightCardProps = {
  item: Highlight
}

export function HighlightCard({ item }: HighlightCardProps) {
  return (
    <Card as="li">
      {item.level ? <Badge>{item.level}</Badge> : null}
      <h3 className="m-0 text-lg font-semibold text-tlc-navy">
        <Link
          className="text-tlc-navy no-underline hover:text-tlc-blue"
          href={`/cursos/${item.id}`}
        >
          {item.title}
        </Link>
      </h3>
      {item.summary ? <p className="m-0 text-sm leading-relaxed">{item.summary}</p> : null}
      <p className="m-0 flex flex-wrap gap-3 text-sm text-tlc-text-strong">
        {item.hours ? <span>{item.hours}</span> : null}
        {item.priceLabel ? <span>{item.priceLabel}</span> : null}
      </p>
    </Card>
  )
}
