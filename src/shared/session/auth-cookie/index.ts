export const AUTH_COOKIE_NAME = 'tlc_session'

export function serializeAuthCookie(token: string): string {
  return `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax`
}

export function serializeClearedAuthCookie(): string {
  return `${AUTH_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
}

export function readAuthTokenFromCookieHeader(
  cookieHeader: string | undefined,
): string | null {
  if (!cookieHeader) {
    return null
  }

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 0) {
      continue
    }

    const name = part.slice(0, separator).trim()
    if (name !== AUTH_COOKIE_NAME) {
      continue
    }

    return decodeURIComponent(part.slice(separator + 1).trim())
  }

  return null
}

export function isClearedAuthCookie(setCookie: string): boolean {
  return /Max-Age=0/i.test(setCookie)
}
