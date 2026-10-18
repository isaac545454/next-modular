'use client'

import { BulletList } from '@/shared/ui/BulletList'
import { Card } from '@/shared/ui/Card'
import { subtitleClass } from '@/shared/ui/classes'

type CourseSyllabusProps = {
  items: readonly string[]
}

export function CourseSyllabus({ items }: CourseSyllabusProps) {
  return (
    <Card>
      <h2 className={subtitleClass}>Conteúdo</h2>
      <BulletList items={items} />
    </Card>
  )
}
