import type { ReactNode } from 'react'
import './styles/global.css'
import { AppLayout } from './_shell/AppLayout'
import { EventRedirects } from './_shell/event-redirects'
import { Providers } from './_shell/providers'
import { SessionHydrator } from './_shell/SessionHydrator'

export const metadata = {
  title: 'Curso Frontend TLC',
  description:
    'Exemplo Next.js de monolito modular: módulos isolados dentro do App Router, event bus tipado e identidade visual da TECH Leads Club.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <SessionHydrator />
          <EventRedirects />
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  )
}
