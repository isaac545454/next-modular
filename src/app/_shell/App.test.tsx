import { StrictMode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getPublishedModulePaths } from './bootstrap-modules'
import { httpClient } from '@/shared/http'
import { App, renderApp } from '@/test/render-app'

describe('App shell', () => {
  beforeEach(() => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
  })

  it('monta o shell sem erro', async () => {
    render(<App />)

    expect(screen.getByText('Curso Frontend TLC')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('exibe a home na rota raiz', async () => {
    renderApp({ route: '/' })

    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('mantém o shell e mostra 404 em rota inexistente', async () => {
    renderApp({ route: '/caminho-inexistente' })

    expect(screen.getByText('Curso Frontend TLC')).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: 'Página não encontrada' }),
    ).toBeInTheDocument()
  })

  it('mostra o painel didático do bus no shell', async () => {
    renderApp()

    expect(
      screen.getByRole('complementary', { name: 'Bus de eventos' }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('mostra links de navegação dos módulos', () => {
    renderApp()

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Checkout' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pagamento' })).toBeInTheDocument()
  })

  it('aplica tokens da identidade visual TLC no shell', async () => {
    renderApp()

    expect(screen.getByRole('banner')).toHaveClass('bg-tlc-dark')
    expect(screen.getByText('◆')).toHaveClass('text-tlc-purple')
    expect(await screen.findByRole('heading', { name: 'Home' })).toHaveClass(
      'text-tlc-navy',
    )
    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('bg-tlc-blue')
  })

  it('registra as rotas dos módulos', async () => {
    renderApp({ route: '/payment' })

    expect(await screen.findByRole('heading', { name: 'Pagamento' })).toBeInTheDocument()
  })

  it('expõe as rotas dos módulos na API pública', () => {
    renderApp({ route: '/login' })

    expect(getPublishedModulePaths()).toEqual(
      expect.arrayContaining([
        '/',
        '/arquitetura',
        '/cursos/:courseId',
        '/login',
        '/conta',
        '/sessao',
        '/checkout',
        '/checkout/oferta',
        '/checkout/pedidos',
        '/payment',
        '/payment/recibo',
        '/payment/sandbox',
      ]),
    )
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('navega pela navbar sem desmontar o shell no StrictMode', async () => {
    const user = userEvent.setup()

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    )

    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument()
    expect(getPublishedModulePaths().length).toBeGreaterThan(0)

    await user.click(screen.getByRole('link', { name: 'Checkout' }))

    expect(screen.getByText('Curso Frontend TLC')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Checkout' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Pagamento' }))

    expect(screen.getByText('Curso Frontend TLC')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Pagamento' })).toBeInTheDocument()
  })
})
