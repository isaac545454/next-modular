import {
  readAuthTokenFromCookieHeader,
  serializeAuthCookie,
  serializeClearedAuthCookie,
} from '@/shared/session/auth-cookie'
import {
  SIMULATED_AUTH_EMAIL,
  SIMULATED_AUTH_PASSWORD,
  SIMULATED_AUTH_TOKEN,
  SIMULATED_AUTH_USER_ID,
} from '../../credentials'

export const AUTH_API_BASE_URL = ''
export const AUTH_LOGIN_PATH = '/api/auth/login'
export const AUTH_LOGOUT_PATH = '/api/auth/logout'
export const AUTH_SESSION_PATH = '/api/auth/session'

export type SimulatedAuthRequest = {
  method: string
  pathname: string
  cookieHeader?: string
  body?: unknown
}

export type SimulatedAuthResponse = {
  status: number
  body: unknown
  setCookie?: string
}

export function isSimulatedAuthPath(pathname: string): boolean {
  const path = normalizePath(pathname)
  return (
    path === AUTH_LOGIN_PATH ||
    path === AUTH_LOGOUT_PATH ||
    path === AUTH_SESSION_PATH
  )
}

export function handleSimulatedAuthRequest(
  request: SimulatedAuthRequest,
): SimulatedAuthResponse {
  const method = request.method.toUpperCase()
  const pathname = normalizePath(request.pathname)

  if (method === 'POST' && pathname === AUTH_LOGIN_PATH) {
    return handleLogin(request.body)
  }

  if (method === 'POST' && pathname === AUTH_LOGOUT_PATH) {
    return {
      status: 204,
      body: null,
      setCookie: serializeClearedAuthCookie(),
    }
  }

  if (method === 'GET' && pathname === AUTH_SESSION_PATH) {
    const token = readAuthTokenFromCookieHeader(request.cookieHeader)
    if (token === SIMULATED_AUTH_TOKEN) {
      return {
        status: 200,
        body: { userId: SIMULATED_AUTH_USER_ID },
      }
    }

    return {
      status: 401,
      body: { message: 'Não autenticado.' },
    }
  }

  return {
    status: 404,
    body: { message: 'Não encontrado.' },
  }
}

function handleLogin(body: unknown): SimulatedAuthResponse {
  const credentials = asCredentials(body)
  const accepted =
    credentials.email === SIMULATED_AUTH_EMAIL &&
    credentials.password === SIMULATED_AUTH_PASSWORD

  if (!accepted) {
    return {
      status: 401,
      body: { message: 'Credenciais inválidas.' },
    }
  }

  return {
    status: 200,
    body: { userId: SIMULATED_AUTH_USER_ID },
    setCookie: serializeAuthCookie(SIMULATED_AUTH_TOKEN),
  }
}

function asCredentials(body: unknown): { email?: string; password?: string } {
  if (!body || typeof body !== 'object') {
    return {}
  }

  const record = body as { email?: unknown; password?: unknown }
  return {
    email: typeof record.email === 'string' ? record.email : undefined,
    password: typeof record.password === 'string' ? record.password : undefined,
  }
}

function normalizePath(pathname: string): string {
  const path = pathname.split('?')[0] ?? pathname
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}
