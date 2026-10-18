/** Testes do hook useListen: snapshot inicial e atualização após emit. */
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { emit, seed } from '../bus'
import { useListen } from '.'

describe('useListen', () => {
  it('vê o último payload emitido antes do mount', () => {
    emit('payment.requested', { checkoutId: 'chk-1' })

    const { result } = renderHook(() => useListen('payment.requested'))

    expect(result.current?.payload).toEqual({ checkoutId: 'chk-1' })
  })

  it('atualiza quando o evento é emitido depois do mount', async () => {
    const { result } = renderHook(() => useListen('auth.signedIn'))

    expect(result.current).toBeNull()

    emit('auth.signedIn', { userId: 'aluno-tlc' })

    await waitFor(() => {
      expect(result.current?.payload).toEqual({ userId: 'aluno-tlc' })
    })
  })

  it('atualiza no seed sem exigir um emit', async () => {
    const { result } = renderHook(() => useListen('auth.signedIn'))

    seed('auth.signedIn', { userId: 'aluno-tlc' })

    await waitFor(() => {
      expect(result.current?.payload).toEqual({ userId: 'aluno-tlc' })
    })
  })
})
