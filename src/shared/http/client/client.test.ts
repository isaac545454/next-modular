import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, describe, expect, it } from 'vitest'
import { clearSession, setSession } from '@/shared/session'
import { APP_CLIENT_HEADER, httpClient } from '.'
import { AppHttpError } from '../errors'

const originalAdapter = httpClient.defaults.adapter

function installAdapter(
  handler: (
    config: InternalAxiosRequestConfig,
  ) => Promise<Partial<AxiosResponse>> | Partial<AxiosResponse>,
) {
  httpClient.defaults.adapter = async (config) => {
    const result = await handler(config)
    const status = result.status ?? 200
    const response = {
      data: result.data ?? {},
      status,
      statusText: result.statusText ?? (status >= 400 ? 'Error' : 'OK'),
      headers: result.headers ?? {},
      config,
    }

    if (status >= 400) {
      const error = new AxiosError(
        `Request failed with status code ${status}`,
        AxiosError.ERR_BAD_RESPONSE,
        config,
        undefined,
        response as AxiosResponse,
      )
      return Promise.reject(error)
    }

    return response
  }
}

afterEach(() => {
  httpClient.defaults.adapter = originalAdapter
  clearSession()
})

describe('httpClient headers', () => {
  it('envia Content-Type JSON e X-App-Client em toda requisição', async () => {
    let captured: InternalAxiosRequestConfig | undefined

    installAdapter((config) => {
      captured = config
      return { status: 200, data: {} }
    })

    await httpClient.get('/ping')

    expect(captured?.headers.get('Content-Type')).toBe('application/json')
    expect(captured?.headers.get('X-App-Client')).toBe(APP_CLIENT_HEADER)
  })

  it('envia cookies (withCredentials) e não anexa Authorization', async () => {
    let captured: InternalAxiosRequestConfig | undefined
    installAdapter((config) => {
      captured = config
      return { status: 200, data: {} }
    })

    await httpClient.get('/ping')
    expect(httpClient.defaults.withCredentials).toBe(true)
    expect(captured?.headers.get('Authorization')).toBeFalsy()

    setSession({ userId: 'aluno-tlc' })
    await httpClient.get('/ping')
    expect(captured?.headers.get('Authorization')).toBeFalsy()
  })
})

describe('httpClient errors', () => {
  it('normaliza 4xx com status e mensagem segura', async () => {
    installAdapter(() => ({
      status: 404,
      data: { message: 'Recurso não encontrado' },
    }))

    const error = await httpClient.get('/missing').catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(AppHttpError)
    expect(error).toMatchObject({
      status: 404,
      message: 'Recurso não encontrado',
    })
  })

  it('normaliza 5xx sem vazar token na mensagem', async () => {
    installAdapter(() => ({
      status: 500,
      data: { message: 'Bearer token-secreto inválido' },
    }))

    const error = await httpClient.get('/boom').catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(AppHttpError)
    expect((error as AppHttpError).status).toBe(500)
    expect((error as AppHttpError).message).not.toMatch(/token-secreto/i)
    expect((error as AppHttpError).message).toBe('A requisição falhou (500).')
  })

  it('normaliza falha de rede', async () => {
    httpClient.defaults.adapter = async () => {
      const error = new AxiosError('Network Error')
      error.code = 'ERR_NETWORK'
      return Promise.reject(error)
    }

    const error = await httpClient.get('/offline').catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(AppHttpError)
    expect(error).toMatchObject({
      status: null,
      isNetworkError: true,
      message: 'Falha de rede. Verifique sua conexão e tente novamente.',
    })
  })
})

describe('axios default validateStatus', () => {
  it('trata status de erro como rejeição do axios', () => {
    expect(axios.defaults.validateStatus?.(404)).toBe(false)
    expect(axios.defaults.validateStatus?.(500)).toBe(false)
    expect(axios.defaults.validateStatus?.(200)).toBe(true)
  })
})
