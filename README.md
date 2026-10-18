# Curso Frontend TLC — Next Modular

App de exemplo em **monolito modular** no App Router: um único pacote na raiz, sem `apps/` nem `packages/`. Turborepo orquestra as tarefas do mesmo projeto.

A diferença em relação ao `vite-modular` (não altere aquele app) é a colocação: os módulos de feature vivem **dentro** de `src/app/modules`. As URLs continuam no App Router (`src/app/(home)`, `src/app/(auth)`, `src/app/checkout`, `src/app/payment`); cada `page.tsx` só reexporta a página do módulo. A comunicação entre features continua pelo event bus em `src/shared/frontend-events`.

A UI usa Tailwind CSS com a identidade visual da TECH Leads Club. O painel **Bus de eventos** no shell é didático: mostra cada `emit` e `seed` do catálogo enquanto você navega o fluxo.

## Demo em 30 segundos

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) e siga:

1. **Home** — catálogo simulado + mapa dos módulos (quem emite, quem escuta).
2. **Entrar** — `aluno@tlc.dev` / `123456` (já preenchido).
3. O shell escuta `auth.signedIn` e vai para o **Checkout**.
4. **Confirmar checkout** emite `checkout.started` + `payment.requested` e cai no **Pagamento**.
5. **Confirmar pagamento** ou **Simular falha** e volte ao checkout pelo mesmo bus.

Olhe o painel à direita: ele é o contrato visível entre os módulos.

```text
auth --auth.signedIn--> shell, home, checkout
checkout --payment.requested--> payment
payment --payment.succeeded--> checkout --checkout.completed-->
```

## Comandos

```bash
pnpm install
pnpm dev          # servidor local
pnpm build        # artefatos em .next/
pnpm start        # serve o build
pnpm quality      # turbo run lint typecheck test
pnpm lint
pnpm typecheck
pnpm test
```

## Ambiente

Copie `.env.example` para `.env` se quiser apontar uma API externa:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

O cliente HTTP compartilhado usa essa base para rotas remotas genéricas. Auth e o catálogo da Home **não** dependem dela: os dois falam com a origem do app (`baseURL` vazio).

Se `NEXT_PUBLIC_API_BASE_URL` estiver ausente, o fallback é `http://localhost:3000` (com aviso no console em desenvolvimento).

## Auth simulada

Credencial aceita no modo simulado:

- e-mail: `aluno@tlc.dev`
- senha: `123456`

O login chama `POST /api/auth/login` na origem do app. Os Route Handlers em `src/app/api` delegam para o handler do módulo e respondem com `Set-Cookie: tlc_session=...; HttpOnly; Path=/; SameSite=Lax`. O token não vai para `sessionStorage`, `localStorage` nem `document.cookie`. `shared/session` guarda só `{ userId }` em memória e restaura pelo `GET /api/auth/session` se o cookie ainda valer.

Não há IdP real neste projeto.

## Catálogo simulado

A Home lê `GET /api/home/highlights` na origem do app (handler em `src/app/modules/home/api/simulated-highlights`, Route Handler em `src/app/api/home/highlights`). Sem backend próprio, o exemplo já abre com uma trilha de cursos.

A query usa o Axios e o TanStack Query compartilhados. Se a leitura falhar, a UI mostra erro com retry e o restante da landing continua navegável.

## Páginas por módulo

Cada feature tem um layout com subnav. O header continua com Home, Entrar, Checkout e Pagamento.

| Módulo | Rotas do App Router |
| --- | --- |
| `home` | `/`, `/arquitetura`, `/cursos/:courseId` |
| `auth` | `/login`, `/conta`, `/sessao` |
| `checkout` | `/checkout`, `/checkout/oferta`, `/checkout/pedidos` |
| `payment` | `/payment`, `/payment/recibo`, `/payment/sandbox` |

Componentes de UI comuns (PageHeader, Card, Button, ModuleSubnav…) ficam em `src/shared/ui`. Componentes de domínio ficam dentro do módulo (`components/`). Cada unidade (componente, página, query, service) vive na própria pasta com `index` — não há arquivo solto do tipo `components/Button.tsx`.

Fluxo de request no módulo: **service → query → hook da tela → UI**. A pasta `query/` nomeia a operação (`query/useQueryHighlights`, `query/useMutationLogin`). O hook da tela mora na pasta da página (`pages/HomePage/useHomePage.ts`); o da UI, na pasta do componente. A UI não chama service nem TanStack Query direto.

## Arquitetura

- `src/app` — App Router (rotas, layout, providers, painel do bus) **e** os módulos
- `src/app/modules` — `auth`, `home`, `payment`, `checkout` (API pública em `index.ts`)
- `src/shared` — HTTP (Axios), Query, sessão, config, **frontend-events** e lista de paths

O pacote lógico `frontend-events` vive em `src/shared/frontend-events` (não é um pacote npm). Módulos de feature não se importam; coordenam pelo bus tipado. O ESLint `no-cross-module-imports` trava `@/modules/*` dentro de outro módulo (agora resolvendo `src/app/modules`).

No Vite, o bootstrap chamava `routeRegistry.register`. Aqui o App Router **é** o registro: `page.tsx` e `layout.tsx` apontam para as páginas/layouts do módulo. O bootstrap só hidrata a sessão e liga `registerCheckout` no bus. Cada módulo ainda exporta `*Routes` (paths) para o contrato público e para os testes.

Estilo: Tailwind (PostCSS) + tokens TLC em `src/app/styles/global.css`. Não há CSS Modules.

O arquivo `pnpm-workspace.yaml` na raiz só autoriza scripts de build (pnpm 11). Não há workspaces, nem pastas `apps/` ou `packages/`.
