import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { confirmCheckout, registerCheckout } from './service/checkout-flow'
import { bus } from '@/shared/frontend-events'
import { renderApp } from '@/test/render-app'

function authenticate() {
  bus.emit('auth.signedIn', { userId: 'aluno-tlc' })
}

describe('checkout module', () => {
  it('renderiza o resumo da oferta', () => {
    renderApp({ route: '/checkout' })

    expect(screen.getByRole('heading', { name: 'Checkout' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Trilha Frontend Modular' })).toBeInTheDocument()
    expect(screen.getByText('R$ 497')).toBeInTheDocument()
  })

  it('bloqueia confirmação sem sessão e libera após auth.signedIn', async () => {
    const user = userEvent.setup()
    renderApp({ route: '/checkout' })

    const confirm = screen.getByRole('button', { name: 'Confirmar checkout' })
    expect(confirm).toBeDisabled()
    expect(screen.getByText(/Autentique-se para confirmar o checkout/)).toBeInTheDocument()

    authenticate()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Confirmar checkout' })).toBeEnabled(),
    )

    await user.click(screen.getByRole('button', { name: 'Confirmar checkout' }))
    expect(await screen.findByRole('heading', { name: 'Pagamento' })).toBeInTheDocument()
  })

  it('coordena checkout e payment só pelo bus', () => {
    const started = vi.fn()
    const requested = vi.fn()
    const completed = vi.fn()

    bus.on('checkout.started', started)
    bus.on('payment.requested', requested)
    bus.on('checkout.completed', completed)
    registerCheckout(bus)

    confirmCheckout()

    expect(started).toHaveBeenCalledOnce()
    expect(requested).toHaveBeenCalledOnce()
    const checkoutId = started.mock.calls[0]?.[0]?.checkoutId as string
    expect(requested).toHaveBeenCalledWith({ checkoutId })

    bus.emit('payment.succeeded', {
      paymentId: 'pay-x',
      checkoutId,
    })
    expect(completed).toHaveBeenCalledExactlyOnceWith({ checkoutId })
  })

  it('mostra erro e permite nova confirmação quando o pagamento falha', async () => {
    const user = userEvent.setup()
    renderApp({ route: '/checkout' })
    authenticate()

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Confirmar checkout' })).toBeEnabled(),
    )
    await user.click(screen.getByRole('button', { name: 'Confirmar checkout' }))

    expect(await screen.findByRole('heading', { name: 'Pagamento' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Simular falha' }))

    expect(await screen.findByRole('heading', { name: 'Checkout' })).toBeInTheDocument()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Pagamento recusado na simulação',
    )
    expect(screen.getByRole('button', { name: 'Confirmar checkout' })).toBeEnabled()
  })

  it('abre a oferta do próprio módulo', () => {
    renderApp({ route: '/checkout/oferta' })
    expect(screen.getByRole('heading', { name: 'Oferta' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Módulo checkout' })).toBeInTheDocument()
  })

  it('abre o histórico vazio', () => {
    renderApp({ route: '/checkout/pedidos' })
    expect(screen.getByRole('heading', { name: 'Histórico' })).toBeInTheDocument()
    expect(screen.getByText('Sem pedido neste navegador')).toBeInTheDocument()
  })
})
