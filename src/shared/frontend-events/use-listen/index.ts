/** Hooks React para ler o último evento do barramento e o userId autenticado. */
import { useSyncExternalStore } from 'react'
import {
  getLast,
  pickLatest,
  subscribeLast,
  type LastEvent,
} from '../bus'
import type { FrontendEventName } from '../catalog'

export function useListen<K extends FrontendEventName>(
  event: K,
): LastEvent<K> | null {
  return useSyncExternalStore(
    (onStoreChange) => subscribeLast(event, onStoreChange),
    () => getLast(event),
    () => getLast(event),
  )
}

export function useSignedInUserId(): string | null {
  const signedIn = useListen('auth.signedIn')
  const signedOut = useListen('auth.signedOut')
  const latest = pickLatest(signedIn, signedOut)
  return latest === signedIn ? (signedIn?.payload.userId ?? null) : null
}
