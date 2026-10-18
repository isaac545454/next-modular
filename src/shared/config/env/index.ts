export const API_BASE_URL_FALLBACK = 'http://localhost:3000'

type EnvLike = {
  NEXT_PUBLIC_API_BASE_URL?: string
  NODE_ENV?: string
}

const defaultEnv: EnvLike = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
}

export function getApiBaseUrl(env: EnvLike = defaultEnv): string {
  const value = env.NEXT_PUBLIC_API_BASE_URL?.trim()

  if (value) {
    return value.replace(/\/$/, '')
  }

  if (env.NODE_ENV === 'development') {
    console.warn(
      `[config] NEXT_PUBLIC_API_BASE_URL não definida. Usando fallback ${API_BASE_URL_FALLBACK}`,
    )
  }

  return API_BASE_URL_FALLBACK
}
