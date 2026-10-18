import { describe, expect, it } from 'vitest'
import { clearSession, getSession, setSession } from '.'

describe('session', () => {
  it('grava a sessão em memória', () => {
    const session = { userId: 'aluno-tlc' }

    setSession(session)

    expect(getSession()).toEqual(session)
  })

  it('lê a sessão gravada', () => {
    setSession({ userId: 'aluno-tlc' })

    expect(getSession()?.userId).toBe('aluno-tlc')
  })

  it('limpa a sessão da memória', () => {
    setSession({ userId: 'aluno-tlc' })

    clearSession()

    expect(getSession()).toBeNull()
  })
})
