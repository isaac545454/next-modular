/** Ponto de entrada do módulo: reexporta catálogo, barramento e hooks. */
export type {
  EventCatalog,
  FrontendEventListener,
  FrontendEventName,
  FrontendEventPayload,
} from './catalog'
export { FRONTEND_EVENT_NAMES, catalogNamesAreExhaustive } from './catalog'
export {
  bus,
  clearAllListeners,
  emit,
  FrontendEventBus,
  getLast,
  off,
  on,
  pickLatest,
  resetFrontendEvents,
  seed,
  type LastEvent,
} from './bus'
export { useListen, useSignedInUserId } from './use-listen'
