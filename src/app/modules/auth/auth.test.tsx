import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { hydrateSession, login, logout } from './service/session'
import {
  SIMULATED_AUTH_EMAIL,
  SIMULATED_AUTH_PASSWORD,
  SIMULATED_AUTH_TOKEN,
  SIMULATED_AUTH_USER_ID,
} from './credentials'
import { bus, getLast } from '@/shared/frontend-events'
import { clearSession, getSession } from '@/shared/session'
import { renderApp } from '@/test/render-app'

describe('auth module', () => {
  it('renderiza o formulário em /login com valores preenchidos', () => {
    renderApp({ route: '/login' })

    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toHaveValue(SIMULATED_AUTH_EMAIL)
    expect(screen.getByLabelText('Senha')).toHaveValue(SIMULATED_AUTH_PASSWORD)
  })

  it('grava só o userId, emite auth.signedIn e não expõe o token ao JS', async () => {
    const listener = vi.fn()
    bus.on('auth.signedIn', listener)

    await login()

    expect(getSession()).toEqual({ userId: SIMULATED_AUTH_USER_ID })
    expect(getSession()).not.toHaveProperty('token')
    expect(document.cookie).not.toContain(SIMULATED_AUTH_TOKEN)
    expect(sessionStorage.getItem('curso-frontend-tlc.session')).toBeNull()
    expect(listener).toHaveBeenCalledExactlyOnceWith({ userId: SIMULATED_AUTH_USER_ID })
  })

  it('restaura o userId a partir do cookie httpOnly sem emitir redirect', async () => {
    await login()
    clearSession()
    expect(getSession()).toBeNull()

    const listener = vi.fn()
    bus.on('auth.signedIn', listener)
    await hydrateSession()

    expect(getSession()).toEqual({ userId: SIMULATED_AUTH_USER_ID })
    expect(getLast('auth.signedIn')?.payload).toEqual({ userId: SIMULATED_AUTH_USER_ID })
    expect(listener).not.toHaveBeenCalled()
  })

  it('mostra erro com credenciais inválidas e não cria sessão', async () => {
    const user = userEvent.setup()
    const listener = vi.fn()
    bus.on('auth.signedIn', listener)

    renderApp({ route: '/login' })

    await user.clear(screen.getByLabelText('E-mail'))
    await user.type(screen.getByLabelText('E-mail'), 'errado@tlc.dev')
    await user.clear(screen.getByLabelText('Senha'))
    await user.type(screen.getByLabelText('Senha'), 'senha-errada')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciais inválidas.')
    expect(getSession()).toBeNull()
    expect(listener).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('entra com a credencial simulada e some o link Entrar do header', async () => {
    const user = userEvent.setup()

    renderApp({ route: '/login' })
    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(getSession()?.userId).toBe(SIMULATED_AUTH_USER_ID)
    expect(await screen.findByRole('heading', { name: 'Checkout' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Entrar' })).not.toBeInTheDocument()
  })

  it('limpa a sessão e emite auth.signedOut no logout', async () => {
    const listener = vi.fn()
    bus.on('auth.signedOut', listener)
    await login()

    await logout()

    expect(getSession()).toBeNull()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('renderiza a conta sem sessão', () => {
    renderApp({ route: '/conta' })
    expect(screen.getByRole('heading', { name: 'Conta' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Módulo auth' })).toBeInTheDocument()
  })

  it('renderiza o guia de sessão', () => {
    renderApp({ route: '/sessao' })
    expect(screen.getByRole('heading', { name: 'Sessão' })).toBeInTheDocument()
    expect(screen.getByText(/HttpOnly/)).toBeInTheDocument()
  })
})
