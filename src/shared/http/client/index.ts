import axios, { AxiosError } from 'axios'
import { getApiBaseUrl } from '@/shared/config'
import { AppHttpError, toSafeHttpMessage } from '../errors'

export const APP_CLIENT_HEADER = 'curso-frontend-tlc'

export const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Client': APP_CLIENT_HEADER,
  },
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error instanceof AppHttpError) {
      return Promise.reject(error)
    }

    if (axios.isAxiosError(error)) {
      return Promise.reject(normalizeAxiosError(error))
    }

    return Promise.reject(
      new AppHttpError({
        status: null,
        message: 'Não foi possível concluir a requisição.',
        isNetworkError: true,
      }),
    )
  },
)

function normalizeAxiosError(error: AxiosError): AppHttpError {
  const isNetworkError = !error.response
  const status = error.response?.status ?? null

  return new AppHttpError({
    status,
    message: toSafeHttpMessage(status, error.response?.data, isNetworkError),
    body: error.response?.data,
    isNetworkError,
  })
}
