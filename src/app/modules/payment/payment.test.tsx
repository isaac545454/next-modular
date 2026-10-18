import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  failSimulatedPayment,
  succeedSimulatedPayment,
} from './service/simulated-payment'
import { bus } from '@/shared/frontend-events'
import { renderApp } from '@/test/render-app'

describe('payment module', () => {
  it('renderiza a UI de pagamento em /payment', () => {
    renderApp({ route: '/payment' })

    expect(screen.getByRole('heading', { name: 'Pagamento' })).toBeInTheDocument()
  })

  it('publica payment.succeeded após confirmação simulada', () => {
    const succeeded = vi.fn()
    bus.on('payment.succeeded', succeeded)

    bus.emit('payment.requested', { checkoutId: 'chk-1' })
    succeedSimulatedPayment()

    expect(succeeded).toHaveBeenCalledExactlyOnceWith({
      paymentId: 'pay-chk-1',
      checkoutId: 'chk-1',
    })
  })

  it('publica payment.failed com motivo seguro', () => {
    const failed = vi.fn()
    bus.on('payment.failed', failed)

    bus.emit('payment.requested', { checkoutId: 'chk-2' })
    failSimulatedPayment('Pagamento recusado na simulação')

    expect(failed).toHaveBeenCalledExactlyOnceWith({
      checkoutId: 'chk-2',
      reason: 'Pagamento recusado na simulação',
    })
  })

  it('abre recibo vazio', () => {
    renderApp({ route: '/payment/recibo' })
    expect(screen.getByRole('heading', { name: 'Recibo' })).toBeInTheDocument()
    expect(screen.getByText(/Nenhum pagamento confirmado ainda/)).toBeInTheDocument()
  })

  it('abre o guia do sandbox', () => {
    renderApp({ route: '/payment/sandbox' })
    expect(screen.getByRole('heading', { name: 'Sandbox' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Módulo payment' })).toBeInTheDocument()
  })
})
