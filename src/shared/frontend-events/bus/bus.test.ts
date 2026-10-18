/** Testes do barramento: inscrição, emissão, snapshot e log em desenvolvimento. */
import { describe, expect, it, vi } from 'vitest'
import {
  emit,
  getLast,
  logEmittedEvent,
  off,
  on,
  pickLatest,
  seed,
} from '.'

describe('frontend-events bus', () => {
  it('entrega o payload ao listener inscrito', () => {
    const listener = vi.fn()
    on('auth.signedIn', listener)

    emit('auth.signedIn', { userId: 'aluno-tlc' })

    expect(listener).toHaveBeenCalledExactlyOnceWith({ userId: 'aluno-tlc' })
  })

  it('remove apenas o listener desinscrito', () => {
    const kept = vi.fn()
    const removed = vi.fn()

    on('payment.succeeded', kept)
    on('payment.succeeded', removed)
    off('payment.succeeded', removed)

    emit('payment.succeeded', {
      paymentId: 'pay-1',
      checkoutId: 'chk-1',
    })

    expect(kept).toHaveBeenCalledOnce()
    expect(removed).not.toHaveBeenCalled()
  })

  it('guarda o último payload com seq crescente', () => {
    emit('checkout.started', { checkoutId: 'chk-1' })
    emit('payment.requested', { checkoutId: 'chk-1' })

    const started = getLast('checkout.started')
    const requested = getLast('payment.requested')

    expect(started?.payload).toEqual({ checkoutId: 'chk-1' })
    expect(requested?.payload).toEqual({ checkoutId: 'chk-1' })
    expect(requested?.seq).toBeGreaterThan(started?.seq ?? 0)
  })

  it('não dispara listeners de on ao semear', () => {
    const listener = vi.fn()
    on('auth.signedIn', listener)

    seed('auth.signedIn', { userId: 'aluno-tlc' })

    expect(listener).not.toHaveBeenCalled()
    expect(getLast('auth.signedIn')?.payload).toEqual({ userId: 'aluno-tlc' })
  })

  it('escolhe o último evento pelo seq', () => {
    emit('payment.requested', { checkoutId: 'chk-1' })
    emit('payment.succeeded', { paymentId: 'pay-1', checkoutId: 'chk-1' })

    const requested = getLast('payment.requested')
    const succeeded = getLast('payment.succeeded')

    expect(pickLatest(requested, succeeded)).toBe(succeeded)
    expect(pickLatest(requested, null)).toBe(requested)
  })

  it('registra o disparo no console em desenvolvimento', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})

    logEmittedEvent('auth.signedIn', { userId: 'aluno-tlc' }, 1, { DEV: true })

    expect(info).toHaveBeenCalledExactlyOnceWith(
      '[frontend-events] emit',
      'auth.signedIn',
      { userId: 'aluno-tlc' },
      { listeners: 1 },
    )
  })

  it('não registra o disparo fora de desenvolvimento', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})

    logEmittedEvent('auth.signedOut', {}, 0, { DEV: false })

    expect(info).not.toHaveBeenCalled()
  })

  it('não registra o disparo no modo de teste', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})

    logEmittedEvent('auth.signedOut', {}, 0, { DEV: true, MODE: 'test' })

    expect(info).not.toHaveBeenCalled()
  })
})
