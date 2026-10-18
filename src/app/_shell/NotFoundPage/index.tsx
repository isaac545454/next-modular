'use client'

import Link from 'next/link'
import { StatusMessage } from '@/shared/ui/StatusMessage'
import { kickerClass, linkClass, pageClass, titleClass } from '@/shared/ui/classes'

export function NotFoundPage() {
  return (
    <section className={pageClass}>
      <p className={kickerClass}>Rota fora do App Router</p>
      <h1 className={titleClass}>Página não encontrada</h1>
      <StatusMessage tone="empty">
        Esse caminho não corresponde a nenhuma rota do App Router.
      </StatusMessage>
      <p className="m-0 text-sm">
        Volte para a{' '}
        <Link className={linkClass} href="/">
          Home
        </Link>
        {' '}
        ou escolha um módulo no header.
      </p>
    </section>
  )
}
