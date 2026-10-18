import { describe, expect, it } from 'vitest'
import {
  handleSimulatedAuthRequest,
  AUTH_LOGIN_PATH,
  AUTH_LOGOUT_PATH,
  AUTH_SESSION_PATH,
} from '.'
import {
  SIMULATED_AUTH_EMAIL,
  SIMULATED_AUTH_PASSWORD,
  SIMULATED_AUTH_TOKEN,
  SIMULATED_AUTH_USER_ID,
} from '../../credentials'
import { AUTH_COOKIE_NAME } from '@/shared/session/auth-cookie'

describe('simulated auth handler', () => {
  it('define Set-Cookie HttpOnly no login válido', () => {
    const result = handleSimulatedAuthRequest({
      method: 'POST',
      pathname: AUTH_LOGIN_PATH,
      body: { email: SIMULATED_AUTH_EMAIL, password: SIMULATED_AUTH_PASSWORD },
    })

    expect(result.status).toBe(200)
    expect(result.body).toEqual({ userId: SIMULATED_AUTH_USER_ID })
    expect(result.setCookie).toContain(`${AUTH_COOKIE_NAME}=${SIMULATED_AUTH_TOKEN}`)
    expect(result.setCookie).toMatch(/HttpOnly/i)
  })

  it('rejeita credenciais inválidas sem cookie', () => {
    const result = handleSimulatedAuthRequest({
      method: 'POST',
      pathname: AUTH_LOGIN_PATH,
      body: { email: 'errado@tlc.dev', password: 'senha-errada' },
    })

    expect(result.status).toBe(401)
    expect(result.setCookie).toBeUndefined()
  })

  it('lê a sessão só se o cookie httpOnly for o token simulado', () => {
    const missing = handleSimulatedAuthRequest({
      method: 'GET',
      pathname: AUTH_SESSION_PATH,
    })
    expect(missing.status).toBe(401)

    const present = handleSimulatedAuthRequest({
      method: 'GET',
      pathname: AUTH_SESSION_PATH,
      cookieHeader: `${AUTH_COOKIE_NAME}=${SIMULATED_AUTH_TOKEN}`,
    })
    expect(present.status).toBe(200)
    expect(present.body).toEqual({ userId: SIMULATED_AUTH_USER_ID })
  })

  it('limpa o cookie no logout', () => {
    const result = handleSimulatedAuthRequest({
      method: 'POST',
      pathname: AUTH_LOGOUT_PATH,
    })

    expect(result.status).toBe(204)
    expect(result.setCookie).toMatch(/Max-Age=0/i)
    expect(result.setCookie).toMatch(/HttpOnly/i)
  })
})
