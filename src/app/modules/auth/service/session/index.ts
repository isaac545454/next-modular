import { bus, seed } from '@/shared/frontend-events'
import { AppHttpError, httpClient } from '@/shared/http'
import { clearSession, setSession } from '@/shared/session'
import {
  SIMULATED_AUTH_EMAIL,
  SIMULATED_AUTH_PASSWORD,
} from '../../credentials'
import {
  AUTH_API_BASE_URL,
  AUTH_LOGIN_PATH,
  AUTH_LOGOUT_PATH,
  AUTH_SESSION_PATH,
} from '../../api/simulated-auth-handler'

const authRequestConfig = { baseURL: AUTH_API_BASE_URL } as const

export async function login(
  email: string = SIMULATED_AUTH_EMAIL,
  password: string = SIMULATED_AUTH_PASSWORD,
): Promise<void> {
  const { data } = await httpClient.post<{ userId: string }>(
    AUTH_LOGIN_PATH,
    { email, password },
    authRequestConfig,
  )

  setSession({ userId: data.userId })
  bus.emit('auth.signedIn', { userId: data.userId })
}

export async function logout(): Promise<void> {
  try {
    await httpClient.post(AUTH_LOGOUT_PATH, undefined, authRequestConfig)
  } catch (error) {
    if (!(error instanceof AppHttpError)) {
      throw error
    }
  } finally {
    clearSession()
    bus.emit('auth.signedOut', {})
  }
}

export async function hydrateSession(): Promise<void> {
  try {
    const { data } = await httpClient.get<{ userId: string }>(
      AUTH_SESSION_PATH,
      authRequestConfig,
    )

    if (typeof data?.userId === 'string') {
      setSession({ userId: data.userId })
      seed('auth.signedIn', { userId: data.userId })
    }
  } catch {
    // Cookie ausente ou inválido: a sessão em memória permanece como está.
  }
}
