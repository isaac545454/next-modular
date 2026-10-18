'use client'

import { Card } from '@/shared/ui/Card'
import { subtitleClass } from '@/shared/ui/classes'
import { architectureFaq } from '../../service/architecture'

export function ArchitectureFaq() {
  return (
    <div className="grid gap-3">
      <h2 className={subtitleClass}>Perguntas frequentes</h2>
      <ul className="m-0 grid list-none gap-3 p-0">
        {architectureFaq.map((item) => (
          <Card as="li" key={item.question}>
            <h3 className="m-0 text-base font-semibold text-tlc-navy">{item.question}</h3>
            <p className="m-0 text-sm leading-relaxed">{item.answer}</p>
          </Card>
        ))}
      </ul>
    </div>
  )
}
