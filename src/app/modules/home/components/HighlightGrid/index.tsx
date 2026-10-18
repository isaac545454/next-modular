'use client'

import type { Highlight } from '../../service/highlights'
import { HighlightCard } from '../HighlightCard'

type HighlightGridProps = {
  items: Highlight[]
}

export function HighlightGrid({ items }: HighlightGridProps) {
  return (
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
      {items.map((item) => (
        <HighlightCard key={item.id} item={item} />
      ))}
    </ul>
  )
}
