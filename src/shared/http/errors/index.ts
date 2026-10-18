export class AppHttpError extends Error {
  readonly status: number | null
  readonly body: unknown
  readonly isNetworkError: boolean

  constructor(args: {
    status: number | null
    message: string
    body?: unknown
    isNetworkError?: boolean
  }) {
    super(args.message)
    this.name = 'AppHttpError'
    this.status = args.status
    this.body = args.body
    this.isNetworkError = args.isNetworkError ?? false
  }
}

const SECRET_PATTERN = /token|secret|authorization|bearer|password/i

export function toSafeHttpMessage(
  status: number | null,
  payload: unknown,
  isNetworkError: boolean,
): string {
  if (isNetworkError) {
    return 'Falha de rede. Verifique sua conexão e tente novamente.'
  }

  if (payload && typeof payload === 'object' && 'message' in payload) {
    const candidate = (payload as { message: unknown }).message
    if (typeof candidate === 'string' && candidate.trim() && !SECRET_PATTERN.test(candidate)) {
      return candidate
    }
  }

  if (status) {
    return `A requisição falhou (${status}).`
  }

  return 'Não foi possível concluir a requisição.'
}
