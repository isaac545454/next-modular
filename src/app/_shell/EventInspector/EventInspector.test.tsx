import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { bus } from '@/shared/frontend-events'
import { httpClient } from '@/shared/http'
import { renderApp } from '@/test/render-app'

function inspector() {
  return screen.getByRole('complementary', { name: 'Bus de eventos' })
}

describe('EventInspector', () => {
  it('mostra o painel didático no shell', () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
    renderApp()

    expect(inspector()).toBeInTheDocument()
    expect(
      within(inspector()).getByRole('heading', { name: 'Bus de eventos' }),
    ).toBeInTheDocument()
  })

  it('registra emits do fluxo login → checkout', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
    const user = userEvent.setup()
    renderApp({ route: '/login' })

    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('heading', { name: 'Checkout' })).toBeInTheDocument()
    expect(within(inspector()).getByText('auth.signedIn')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Confirmar checkout' }))

    expect(await screen.findByRole('heading', { name: 'Pagamento' })).toBeInTheDocument()
    expect(within(inspector()).getByText('checkout.started')).toBeInTheDocument()
    expect(within(inspector()).getByText('payment.requested')).toBeInTheDocument()
  })

  it('marca seed de sessão como snapshot, sem emitir', () => {
    bus.seed('auth.signedIn', { userId: 'aluno-tlc' })
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
    renderApp({ route: '/' })

    expect(within(inspector()).getByText('auth.signedIn')).toBeInTheDocument()
    expect(within(inspector()).getByText(/seed/)).toBeInTheDocument()
  })
})
