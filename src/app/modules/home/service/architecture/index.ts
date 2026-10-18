export const homeModules = [
  {
    name: 'auth',
    role: 'Identidade',
    emits: ['auth.signedIn', 'auth.signedOut'],
    listens: '—',
  },
  {
    name: 'home',
    role: 'Catálogo',
    emits: '—',
    listens: ['auth.signedIn', 'auth.signedOut'],
  },
  {
    name: 'checkout',
    role: 'Pedido',
    emits: ['checkout.started', 'payment.requested', 'checkout.completed'],
    listens: ['auth.signedIn', 'payment.succeeded', 'payment.failed'],
  },
  {
    name: 'payment',
    role: 'PSP simulado',
    emits: ['payment.succeeded', 'payment.failed'],
    listens: ['payment.requested'],
  },
] as const

export const architectureFaq = [
  {
    question: 'Por que os módulos não se importam?',
    answer:
      'Importação cruzada vira um grafo de features. O bus tipado deixa o contrato explícito e o ESLint impede o atalho.',
  },
  {
    question: 'Quem monta as rotas?',
    answer:
      'O App Router em src/app registra as URLs. Cada page.tsx só reexporta a página do módulo em src/app/modules. O bootstrap só liga o bus.',
  },
  {
    question: 'O painel do bus faz parte da arquitetura?',
    answer:
      'Não. Ele é didático e mora no shell. As features continuariam iguais se o painel sumisse.',
  },
] as const

export function formatEventList(value: string | readonly string[]): string {
  return typeof value === 'string' ? value : value.join(', ')
}
