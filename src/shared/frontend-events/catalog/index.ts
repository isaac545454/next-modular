/** Catálogo tipado: nomes de eventos e o payload de cada um. */
export type EventCatalog = {
  'auth.signedIn': { userId: string }
  'auth.signedOut': Record<string, never>
  'checkout.started': { checkoutId: string }
  'checkout.completed': { checkoutId: string }
  'payment.requested': { checkoutId: string }
  'payment.succeeded': { paymentId: string; checkoutId: string }
  'payment.failed': { checkoutId: string; reason: string }
}

/** Lista em runtime dos eventos do catálogo — usada pelo painel didático do shell. */
export const FRONTEND_EVENT_NAMES = [
  'auth.signedIn',
  'auth.signedOut',
  'checkout.started',
  'checkout.completed',
  'payment.requested',
  'payment.succeeded',
  'payment.failed',
] as const satisfies ReadonlyArray<keyof EventCatalog>

type CatalogEventName = keyof EventCatalog
type ListedEventName = (typeof FRONTEND_EVENT_NAMES)[number]
type MissingEventNames = Exclude<CatalogEventName, ListedEventName>

/** Falha no typecheck se um evento do catálogo ficar de fora de `FRONTEND_EVENT_NAMES`. */
export const catalogNamesAreExhaustive: MissingEventNames extends never
  ? true
  : MissingEventNames = true

export type FrontendEventName = keyof EventCatalog
export type FrontendEventPayload<K extends FrontendEventName> = EventCatalog[K]
export type FrontendEventListener<K extends FrontendEventName> = (
  payload: FrontendEventPayload<K>,
) => void
