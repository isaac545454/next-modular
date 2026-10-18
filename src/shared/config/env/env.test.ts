import { afterEach, describe, expect, it, vi } from 'vitest'
import { API_BASE_URL_FALLBACK, getApiBaseUrl } from '.'

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('usa a variável de ambiente quando ela está presente', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(
      getApiBaseUrl({
        NEXT_PUBLIC_API_BASE_URL: 'https://api.tlc.dev/',
        NODE_ENV: 'development',
      }),
    ).toBe('https://api.tlc.dev')
    expect(warn).not.toHaveBeenCalled()
  })

  it('usa o fallback local e avisa em desenvolvimento quando a env está ausente', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(
      getApiBaseUrl({
        NODE_ENV: 'development',
      }),
    ).toBe(API_BASE_URL_FALLBACK)
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0]?.[0]).toContain(API_BASE_URL_FALLBACK)
  })
})
