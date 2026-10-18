/** Teste de tipos: garante que emit rejeita eventos fora do catálogo. */
import { describe, expect, it } from 'vitest'
import { emit } from '../bus'
import {
  FRONTEND_EVENT_NAMES,
  catalogNamesAreExhaustive,
  type FrontendEventName,
} from '.'

/**
 * Asserção TypeScript: `emit` só aceita nomes do catálogo.
 * Este arquivo falha no typecheck se um evento desconhecido passar a ser aceito.
 */
export function assertUnknownEventIsRejected(): void {
  // @ts-expect-error evento fora do catálogo deve falhar no typecheck
  emit('frontend.unknown', {})
}

describe('catálogo tipado', () => {
  it('rejeita evento fora do catálogo no typecheck', () => {
    type UnknownEvent = 'frontend.unknown' extends FrontendEventName ? true : false
    const unknownIsForbidden: UnknownEvent = false

    expect(unknownIsForbidden).toBe(false)
    expect(assertUnknownEventIsRejected).toBeTypeOf('function')
  })

  it('lista em runtime todos os eventos do catálogo', () => {
    expect(catalogNamesAreExhaustive).toBe(true)
    expect(FRONTEND_EVENT_NAMES).toEqual([
      'auth.signedIn',
      'auth.signedOut',
      'checkout.started',
      'checkout.completed',
      'payment.requested',
      'payment.succeeded',
      'payment.failed',
    ])
  })
})
