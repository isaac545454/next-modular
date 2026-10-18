'use client'

import { useEffect, useState } from 'react'
import {
  FRONTEND_EVENT_NAMES,
  bus,
  getLast,
  type FrontendEventName,
  type FrontendEventPayload,
} from '@/shared/frontend-events'

type EventLogEntry = {
  seq: number
  name: FrontendEventName
  payload: FrontendEventPayload<FrontendEventName>
  kind: 'snapshot' | 'emit'
}

const familyClass: Record<'auth' | 'checkout' | 'payment', string> = {
  auth: 'text-tlc-purple',
  checkout: 'text-tlc-blue-soft',
  payment: 'text-tlc-success-soft',
}

function familyOf(name: FrontendEventName): keyof typeof familyClass {
  if (name.startsWith('auth.')) {
    return 'auth'
  }
  if (name.startsWith('payment.')) {
    return 'payment'
  }
  return 'checkout'
}

function snapshotEntries(): EventLogEntry[] {
  return FRONTEND_EVENT_NAMES.flatMap((name) => {
    const last = getLast(name)
    if (!last) {
      return []
    }

    return [
      {
        seq: last.seq,
        name,
        payload: last.payload,
        kind: 'snapshot' as const,
      },
    ]
  }).sort((left, right) => left.seq - right.seq)
}

export function EventInspector() {
  const [entries, setEntries] = useState<EventLogEntry[]>(snapshotEntries)

  useEffect(() => {
    const unsubscribes = FRONTEND_EVENT_NAMES.map((name) => {
      const listener = (payload: FrontendEventPayload<typeof name>) => {
        const last = getLast(name)
        setEntries((current) => [
          ...current,
          {
            seq: last?.seq ?? current.length + 1,
            name,
            payload,
            kind: 'emit',
          },
        ])
      }

      bus.on(name, listener)
      return () => bus.off(name, listener)
    })

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe())
  }, [])

  return (
    <aside
      className="grid h-fit gap-3 rounded-tlc bg-tlc-dark p-4 text-white shadow-tlc lg:sticky lg:top-4"
      aria-label="Bus de eventos"
    >
      <div className="grid gap-1">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-tlc-purple">
          Painel didático
        </p>
        <h2 className="m-0 text-base font-semibold text-white">Bus de eventos</h2>
        <p className="m-0 text-xs leading-relaxed text-white/70">
          O shell escuta o mesmo catálogo para redirecionar. Módulos não se importam.
        </p>
      </div>
      {entries.length === 0 ? (
        <p className="m-0 rounded-tlc bg-white/5 px-3 py-2.5 text-sm text-white/70">
          Nenhum evento ainda. Entre ou confirme o checkout para ver o bus em ação.
        </p>
      ) : (
        <ol
          className="m-0 grid max-h-[28rem] list-none gap-2 overflow-y-auto p-0"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {entries.map((entry) => (
            <li
              key={`${entry.kind}-${entry.seq}-${entry.name}`}
              className="rounded-tlc bg-white/5 px-3 py-2"
            >
              <p className="m-0 flex items-center justify-between gap-2 text-xs">
                <span className={`font-semibold ${familyClass[familyOf(entry.name)]}`}>
                  {entry.name}
                </span>
                <span className="text-white/45">
                  #{entry.seq}
                  {entry.kind === 'snapshot' ? ' · seed' : ''}
                </span>
              </p>
              <pre className="m-0 mt-1 overflow-x-auto text-[0.7rem] leading-snug text-tlc-success-soft">
                {JSON.stringify(entry.payload)}
              </pre>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}
