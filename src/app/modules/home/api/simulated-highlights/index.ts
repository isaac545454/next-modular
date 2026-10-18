import type { Highlight } from '../../service/highlights'

export const HIGHLIGHTS_API_BASE_URL = ''
export const HIGHLIGHTS_PATH = '/api/home/highlights'

export const SIMULATED_HIGHLIGHTS: Highlight[] = [
  {
    id: 'trilha-frontend',
    title: 'Trilha Frontend Modular',
    summary:
      'App Router em um único pacote, com módulos isolados em src/app/modules, bus tipado e páginas de rota finas.',
    level: 'Avançado',
    hours: '12h',
    priceLabel: 'R$ 497',
    audience: 'Quem já escreve React e quer um monolito que escala por feature.',
    syllabus: [
      'Mapa de pastas: src/app (rotas + modules), src/shared',
      'API pública do módulo e bootstrap síncrono',
      'Catálogo de eventos e painel didático do shell',
    ],
  },
  {
    id: 'http-query',
    title: 'HTTP + TanStack Query',
    summary:
      'Um Axios, um QueryClient e estados de carregamento, vazio e erro na Home.',
    level: 'Intermediário',
    hours: '4h',
    priceLabel: 'Incluso',
    audience: 'Quem precisa de um cliente HTTP único entre módulos.',
    syllabus: [
      'Instância Axios compartilhada e AppHttpError',
      'createQueryKey por módulo e recurso',
      'Retry e estado vazio na UI da Home',
    ],
  },
  {
    id: 'auth-http-only',
    title: 'Auth com cookie HttpOnly',
    summary:
      'O token nunca chega ao JavaScript. A sessão em memória guarda só o userId.',
    level: 'Intermediário',
    hours: '3h',
    priceLabel: 'Incluso',
    audience: 'Quem vai explicar sessão sem vazar o token no DevTools.',
    syllabus: [
      'POST /api/auth/login com Set-Cookie HttpOnly',
      'Sessão { userId } em memória',
      'seed de auth.signedIn no bootstrap, sem redirect',
    ],
  },
  {
    id: 'event-bus',
    title: 'Comunicação só por eventos',
    summary:
      'Checkout e payment se coordenam sem importação cruzada. O shell só redireciona.',
    level: 'Avançado',
    hours: '5h',
    priceLabel: 'Incluso',
    audience: 'Quem precisa coordenar features sem store compartilhada.',
    syllabus: [
      'emit, seed e useListen',
      'Redirects no shell, não no módulo',
      'registerCheckout escuta payment.succeeded',
    ],
  },
]

export type SimulatedHighlightsRequest = {
  method: string
  pathname: string
}

export type SimulatedHighlightsResponse = {
  status: number
  body: unknown
}

export function isSimulatedHighlightsPath(pathname: string): boolean {
  return normalizePath(pathname) === HIGHLIGHTS_PATH
}

export function handleSimulatedHighlightsRequest(
  request: SimulatedHighlightsRequest,
): SimulatedHighlightsResponse {
  const method = request.method.toUpperCase()
  const pathname = normalizePath(request.pathname)

  if (method === 'GET' && pathname === HIGHLIGHTS_PATH) {
    return {
      status: 200,
      body: SIMULATED_HIGHLIGHTS,
    }
  }

  return {
    status: 404,
    body: { message: 'Não encontrado.' },
  }
}

function normalizePath(pathname: string): string {
  const path = pathname.split('?')[0] ?? pathname
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}
