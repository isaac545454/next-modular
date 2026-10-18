'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { bus } from '@/shared/frontend-events'
import type { FrontendEventName } from '@/shared/frontend-events'

export const EVENT_REDIRECTS = {
  'auth.signedIn': '/checkout',
  'auth.signedOut': '/',
  'payment.requested': '/payment',
  'payment.succeeded': '/checkout',
  'payment.failed': '/checkout',
} as const satisfies Partial<Record<FrontendEventName, `/${string}`>>

type RedirectEvent = keyof typeof EVENT_REDIRECTS

export function EventRedirects() {
  const router = useRouter()

  useEffect(() => {
    const events = Object.keys(EVENT_REDIRECTS) as RedirectEvent[]
    const listeners = events.map((event) => {
      const listener = () => router.push(EVENT_REDIRECTS[event])
      bus.on(event, listener)
      return () => bus.off(event, listener)
    })

    return () => listeners.forEach((unsubscribe) => unsubscribe())
  }, [router])

  return null
}
