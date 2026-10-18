'use client'

import { Badge } from '@/shared/ui/Badge'
import { Card } from '@/shared/ui/Card'
import { formatEventList, homeModules } from '../../service/architecture'

export function ArchitectureMap() {
  return (
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
      {homeModules.map((item) => (
        <Card as="li" key={item.name}>
          <Badge>{item.role}</Badge>
          <p className="m-0 font-semibold text-tlc-navy">{item.name}</p>
          <p className="m-0 text-xs text-tlc-text">emite {formatEventList(item.emits)}</p>
          <p className="m-0 text-xs text-tlc-text">escuta {formatEventList(item.listens)}</p>
        </Card>
      ))}
    </ul>
  )
}
