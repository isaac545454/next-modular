import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { bus } from '@/shared/frontend-events'
import { AppHttpError, httpClient } from '@/shared/http'
import { setSession } from '@/shared/session'
import { renderApp } from '@/test/render-app'

describe('home module', () => {
  it('renderiza a landing em /', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
    renderApp({ route: '/' })

    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Como os módulos se falam' }),
    ).toBeInTheDocument()
  })

  it('mostra estado autenticado e visitante via eventos de auth', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
    setSession({ userId: 'aluno-tlc' })
    renderApp({ route: '/' })

    expect(
      await screen.findByText('Olá, aluno-tlc. Sessão autenticada.'),
    ).toBeInTheDocument()

    bus.emit('auth.signedOut', {})
    expect(await screen.findByText(/Visitante/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('mostra os destaques em cards quando a API responde', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'Turma aberta',
          summary: 'Turma da trilha frontend.',
          level: 'Avançado',
        },
      ],
    })
    renderApp({ route: '/' })

    expect(await screen.findByRole('heading', { name: 'Turma aberta' })).toBeInTheDocument()
    expect(screen.getByText('Turma da trilha frontend.')).toBeInTheDocument()
    expect(screen.getByText('Avançado')).toBeInTheDocument()
  })

  it('mostra estado de carregamento', () => {
    vi.spyOn(httpClient, 'get').mockImplementation(
      () => new Promise(() => undefined),
    )
    renderApp({ route: '/' })

    expect(screen.getByText('Carregando destaques…')).toBeInTheDocument()
  })

  it('mostra estado vazio quando a API não retorna itens', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
    renderApp({ route: '/' })

    expect(await screen.findByText('Nenhum destaque no momento.')).toBeInTheDocument()
  })

  it('mostra erro com retry e permite tentar novamente', async () => {
    const get = vi.spyOn(httpClient, 'get')
    get
      .mockRejectedValueOnce(
        new AppHttpError({
          status: 500,
          message: 'A requisição falhou (500).',
        }),
      )
      .mockResolvedValueOnce({
        data: [{ id: '1', title: 'Turma aberta' }],
      })

    const user = userEvent.setup()
    renderApp({ route: '/' })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'A requisição falhou (500).',
    )

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    await waitFor(() => {
      expect(screen.getByText('Turma aberta')).toBeInTheDocument()
    })
  })

  it('abre a página de arquitetura do módulo home', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({ data: [] })
    renderApp({ route: '/arquitetura' })

    expect(await screen.findByRole('heading', { name: 'Arquitetura' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Perguntas frequentes' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Módulo home' })).toBeInTheDocument()
  })

  it('abre o detalhe do curso a partir do card', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'Turma aberta',
          summary: 'Turma da trilha frontend.',
          syllabus: ['Event bus', 'Rotas por módulo'],
        },
      ],
    })
    const user = userEvent.setup()
    renderApp({ route: '/' })

    await user.click(await screen.findByRole('link', { name: 'Turma aberta' }))

    expect(await screen.findByRole('heading', { name: 'Turma aberta' })).toBeInTheDocument()
    expect(screen.getByText('Event bus')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Conteúdo' })).toBeInTheDocument()
  })
})
