/** Barramento em memória: emite, escuta e guarda o último payload de cada evento. */
import type {
  FrontendEventListener,
  FrontendEventName,
  FrontendEventPayload,
} from '../catalog'

export type LastEvent<K extends FrontendEventName = FrontendEventName> = {
  payload: FrontendEventPayload<K>
  seq: number
}

type EventLogEnv = {
  DEV: boolean
  MODE?: string
}

export class FrontendEventBus {
  private readonly listeners = new Map<
    FrontendEventName,
    Set<FrontendEventListener<FrontendEventName>>
  >()
  private readonly snapshotListeners = new Map<FrontendEventName, Set<() => void>>()
  private readonly lastByEvent = new Map<FrontendEventName, LastEvent>()
  private seq = 0

  /** Inscreve um listener chamado a cada `emit` deste evento. */
  on<K extends FrontendEventName>(
    event: K,
    listener: FrontendEventListener<K>,
  ): void {
    const current = this.listeners.get(event) ?? new Set()
    current.add(listener as FrontendEventListener<FrontendEventName>)
    this.listeners.set(event, current)
  }

  /** Remove o listener inscrito com `on`. */
  off<K extends FrontendEventName>(
    event: K,
    listener: FrontendEventListener<K>,
  ): void {
    this.listeners
      .get(event)
      ?.delete(listener as FrontendEventListener<FrontendEventName>)
  }

  /** Inscreve um listener de snapshot e devolve a função de cancelamento. */
  subscribeLast<K extends FrontendEventName>(
    event: K,
    listener: () => void,
  ): () => void {
    const current = this.snapshotListeners.get(event) ?? new Set()
    current.add(listener)
    this.snapshotListeners.set(event, current)
    return () => {
      current.delete(listener)
    }
  }

  /** Avisa os listeners de snapshot que o último payload deste evento mudou. */
  private notifySnapshot(event: FrontendEventName) {
    this.snapshotListeners.get(event)?.forEach((listener) => listener())
  }

  /** Grava o payload, incrementa o seq e avisa os snapshots. */
  private recordLast<K extends FrontendEventName>(
    event: K,
    payload: FrontendEventPayload<K>,
  ): LastEvent<K> {
    this.seq += 1
    const last: LastEvent<K> = { payload, seq: this.seq }
    this.lastByEvent.set(event, last as LastEvent)
    this.notifySnapshot(event)
    return last
  }

  /** Devolve o último payload deste evento, ou `null`. */
  getLast<K extends FrontendEventName>(event: K): LastEvent<K> | null {
    return (this.lastByEvent.get(event) as LastEvent<K> | undefined) ?? null
  }

  /** Entre vários snapshots, devolve o de maior `seq`; ignora `null`. */
  pickLatest(...items: Array<{ seq: number } | null>): { seq: number } | null {
    let best: { seq: number } | null = null
    for (const item of items) {
      if (item && (!best || item.seq > best.seq)) {
        best = item
      }
    }
    return best
  }

  /** Loga o `emit` no console em desenvolvimento, fora de testes. */
  logEmittedEvent(
    event: FrontendEventName,
    payload: unknown,
    listenerCount: number,
    env: EventLogEnv = {
      DEV: process.env.NODE_ENV === 'development',
      MODE: process.env.NODE_ENV,
    },
  ): void {
    if (!env.DEV || env.MODE === 'test') {
      return
    }

    console.info('[frontend-events] emit', event, payload, {
      listeners: listenerCount,
    })
  }

  /** Grava o último payload sem disparar os listeners de `on`. */
  seed<K extends FrontendEventName>(
    event: K,
    payload: FrontendEventPayload<K>,
  ): void {
    this.recordLast(event, payload)
  }

  /** Grava o último payload e dispara os listeners de `on`. */
  emit<K extends FrontendEventName>(
    event: K,
    payload: FrontendEventPayload<K>,
  ): void {
    this.recordLast(event, payload)
    const current = this.listeners.get(event)
    this.logEmittedEvent(event, payload, current?.size ?? 0)
    current?.forEach((listener) => {
      listener(payload)
    })
  }

  /** Remove todos os listeners de `emit` e de snapshot. */
  clearAllListeners(): void {
    this.listeners.clear()
    this.snapshotListeners.clear()
  }

  /** Zera listeners, último payload e o sequencial. */
  reset(): void {
    this.clearAllListeners()
    this.lastByEvent.clear()
    this.seq = 0
  }
}

export const bus = new FrontendEventBus()

export function on<K extends FrontendEventName>(
  event: K,
  listener: FrontendEventListener<K>,
): void {
  bus.on(event, listener)
}

export function off<K extends FrontendEventName>(
  event: K,
  listener: FrontendEventListener<K>,
): void {
  bus.off(event, listener)
}

export function subscribeLast<K extends FrontendEventName>(
  event: K,
  listener: () => void,
): () => void {
  return bus.subscribeLast(event, listener)
}

export function getLast<K extends FrontendEventName>(
  event: K,
): LastEvent<K> | null {
  return bus.getLast(event)
}

export function pickLatest(
  ...items: Array<{ seq: number } | null>
): { seq: number } | null {
  return bus.pickLatest(...items)
}

export function logEmittedEvent(
  event: FrontendEventName,
  payload: unknown,
  listenerCount: number,
    env: EventLogEnv = {
      DEV: process.env.NODE_ENV === 'development',
      MODE: process.env.NODE_ENV,
    },
): void {
  bus.logEmittedEvent(event, payload, listenerCount, env)
}

export function seed<K extends FrontendEventName>(
  event: K,
  payload: FrontendEventPayload<K>,
): void {
  bus.seed(event, payload)
}

export function emit<K extends FrontendEventName>(
  event: K,
  payload: FrontendEventPayload<K>,
): void {
  bus.emit(event, payload)
}

export function clearAllListeners(): void {
  bus.clearAllListeners()
}

export function resetFrontendEvents(): void {
  bus.reset()
}
