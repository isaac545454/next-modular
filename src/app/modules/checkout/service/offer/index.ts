export const checkoutOffer = {
  sku: 'trilha-frontend-modular',
  title: 'Trilha Frontend Modular',
  subtitle: 'Auth, checkout e pagamento sem importação cruzada.',
  priceLabel: 'R$ 497',
  duration: '12h',
  audience: 'Time que quer um exemplo de monolito modular para aula.',
  includes: [
    'Login com cookie HttpOnly — o token não entra no JS',
    'Checkout que só emite e escuta o bus compartilhado',
    'PSP simulado no módulo payment, isolado do restante',
  ],
  syllabus: [
    'Bootstrap síncrono dos quatro módulos',
    'Registro de rotas aninhadas por feature',
    'EventRedirects no shell, sem o módulo conhecer o router',
    'Painel didático do bus para projetar o fluxo',
  ],
} as const
