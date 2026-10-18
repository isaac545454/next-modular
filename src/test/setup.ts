import type { AxiosAdapter } from 'axios'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { teardownModules } from '@/app/_shell/bootstrap-modules'
import { httpClient } from '@/shared/http'
import { resetFrontendEvents } from '@/shared/frontend-events'
import { queryClient } from '@/shared/query'
import { clearSession } from '@/shared/session'
import {
  createSimulatedAuthAdapter,
  resetTestAuthCookieJar,
} from './simulated-auth-adapter'

const fallbackAdapter = httpClient.defaults.adapter
httpClient.defaults.adapter = createSimulatedAuthAdapter(
  typeof fallbackAdapter === 'function'
    ? (fallbackAdapter as AxiosAdapter)
    : undefined,
)

afterEach(() => {
  cleanup()
  teardownModules()
  clearSession()
  resetTestAuthCookieJar()
  resetFrontendEvents()
  queryClient.clear()
})
