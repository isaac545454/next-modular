import { describe, expect, it } from 'vitest'
import {
  AUTH_COOKIE_NAME,
  isClearedAuthCookie,
  readAuthTokenFromCookieHeader,
  serializeAuthCookie,
  serializeClearedAuthCookie,
} from '.'

describe('auth-cookie', () => {
  it('serializa o token com flag HttpOnly', () => {
    const header = serializeAuthCookie('simulated-token-aluno-tlc')

    expect(header).toContain(`${AUTH_COOKIE_NAME}=simulated-token-aluno-tlc`)
    expect(header).toMatch(/HttpOnly/i)
    expect(header).toMatch(/SameSite=Lax/i)
    expect(header).toMatch(/Path=\//i)
  })

  it('lê o token só a partir do cabeçalho Cookie, não de document.cookie', () => {
    const header = `${AUTH_COOKIE_NAME}=simulated-token-aluno-tlc; other=1`

    expect(readAuthTokenFromCookieHeader(header)).toBe('simulated-token-aluno-tlc')
    expect(document.cookie).not.toContain('simulated-token-aluno-tlc')
  })

  it('serializa cookie expirado no logout', () => {
    const header = serializeClearedAuthCookie()

    expect(header).toMatch(/HttpOnly/i)
    expect(isClearedAuthCookie(header)).toBe(true)
  })
})
