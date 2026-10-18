import { authRoutes } from '@/modules/auth'
import { checkoutRoutes, registerCheckout } from '@/modules/checkout'
import { homeRoutes } from '@/modules/home'
import { paymentRoutes } from '@/modules/payment'
import { bus, seed } from '@/shared/frontend-events'
import { listModulePaths } from '@/shared/routes'
import { getSession } from '@/shared/session'

let lastCleanup: (() => void) | null = null

export function bootstrapModules() {
  lastCleanup?.()

  const cleanup = registerCheckout(bus)

  const session = getSession()
  if (session) {
    seed('auth.signedIn', { userId: session.userId })
  }

  lastCleanup = () => {
    cleanup()
    lastCleanup = null
  }

  return lastCleanup
}

export function teardownModules() {
  lastCleanup?.()
}

export function getPublishedModulePaths() {
  return listModulePaths(homeRoutes, authRoutes, checkoutRoutes, paymentRoutes)
}
