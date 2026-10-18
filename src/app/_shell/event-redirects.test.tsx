import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EVENT_REDIRECTS } from './event-redirects'
import { login, logout } from '@/modules/auth'
import { httpClient } from '@/shared/http'
import { setSession } from '@/shared/session'
import { renderApp } from '@/test/render-app'

describe('EventRedirects', () => {
  it('mapeia os eventos do fluxo para as rotas seguintes', () => {
    expect(EVENT_REDIRECTS).toEqual({
      'auth.signedIn': '/checkout',
      'auth.signedOut': '/',
      'payment.requested': '/payment',
      'payment.succeeded': '/checkout',
      'payment.failed': '/checkout',
    })
  })

  it('redireciona login para checkout, pagamento e de volta ao resultado', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
    const user = userEvent.setup()

    renderApp({ route: '/login' })
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('heading', { name: 'Checkout' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Confirmar checkout' }))
    expect(await screen.findByRole('heading', { name: 'Pagamento' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Confirmar pagamento' }))
    expect(await screen.findByRole('heading', { name: 'Checkout' })).toBeInTheDocument()
    expect(await screen.findByText(/concluído/)).toBeInTheDocument()
  })

  it('volta para a home ao emitir auth.signedOut', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
    await login()
    renderApp({ route: '/checkout' })

    expect(await screen.findByRole('heading', { name: 'Checkout' })).toBeInTheDocument()

    await logout()

    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('hidrata sessão existente sem redirecionar', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
    setSession({ userId: 'aluno-tlc' })
    renderApp({ route: '/' })

    expect(
      await screen.findByText('Olá, aluno-tlc. Sessão autenticada.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Checkout' })).not.toBeInTheDocument()
  })
})
