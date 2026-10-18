import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import {
  handleSimulatedAuthRequest,
  isSimulatedAuthPath,
} from '@/modules/auth/api/simulated-auth-handler'
import {
  handleSimulatedHighlightsRequest,
  isSimulatedHighlightsPath,
} from '@/modules/home/api/simulated-highlights'
import {
  AUTH_COOKIE_NAME,
  isClearedAuthCookie,
  readAuthTokenFromCookieHeader,
} from '@/shared/session/auth-cookie'

let jarToken: string | null = null

export function resetTestAuthCookieJar(): void {
  jarToken = null
}

export function getTestAuthCookieHeader(): string | undefined {
  return jarToken ? `${AUTH_COOKIE_NAME}=${jarToken}` : undefined
}

export function createSimulatedAuthAdapter(fallback?: AxiosAdapter): AxiosAdapter {
  return async (config) => {
    const url = axios.getUri(config)
    const pathname = pathnameOf(url)

    if (isSimulatedHighlightsPath(pathname)) {
      return jsonResponse(
        config,
        handleSimulatedHighlightsRequest({
          method: (config.method ?? 'get').toUpperCase(),
          pathname,
        }),
      )
    }

    if (!isSimulatedAuthPath(pathname)) {
      if (typeof fallback === 'function') {
        return fallback(config)
      }

      throw new Error(`Nenhum adapter para ${url}`)
    }

    const cookieHeader =
      headerValue(config, 'Cookie') ?? getTestAuthCookieHeader()
    const result = handleSimulatedAuthRequest({
      method: (config.method ?? 'get').toUpperCase(),
      pathname,
      cookieHeader,
      body: parseBody(config.data),
    })

    if (result.setCookie) {
      applySetCookie(result.setCookie)
    }

    const headers = new AxiosHeaders()
    if (result.setCookie) {
      headers.set('set-cookie', result.setCookie)
    }

    const response: AxiosResponse = {
      data: result.body,
      status: result.status,
      statusText: result.status >= 400 ? 'Error' : 'OK',
      headers,
      config,
    }

    if (result.status >= 400) {
      const error = new AxiosError(
        `Request failed with status code ${result.status}`,
        AxiosError.ERR_BAD_RESPONSE,
        config,
        undefined,
        response,
      )
      return Promise.reject(error)
    }

    return response
  }
}

function jsonResponse(
  config: InternalAxiosRequestConfig,
  result: { status: number; body: unknown },
): AxiosResponse {
  const headers = new AxiosHeaders()
  const response: AxiosResponse = {
    data: result.body,
    status: result.status,
    statusText: result.status >= 400 ? 'Error' : 'OK',
    headers,
    config,
  }

  if (result.status >= 400) {
    const error = new AxiosError(
      `Request failed with status code ${result.status}`,
      AxiosError.ERR_BAD_RESPONSE,
      config,
      undefined,
      response,
    )
    throw error
  }

  return response
}

function applySetCookie(setCookie: string): void {
  if (isClearedAuthCookie(setCookie)) {
    jarToken = null
    return
  }

  jarToken = readAuthTokenFromCookieHeader(setCookie)
}

function parseBody(data: unknown): unknown {
  if (data == null || data === '') {
    return undefined
  }

  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as unknown
    } catch {
      return undefined
    }
  }

  return data
}

function pathnameOf(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return new URL(url).pathname
  }

  return url.split('?')[0] ?? url
}

function headerValue(
  config: InternalAxiosRequestConfig,
  name: string,
): string | undefined {
  const value = config.headers.get(name)
  return typeof value === 'string' && value.length > 0 ? value : undefined
}
