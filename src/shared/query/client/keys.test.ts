import { describe, expect, it } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { createQueryKey, queryClient } from '.'

describe('query client', () => {
  it('expõe um QueryClient único', () => {
    expect(queryClient).toBeInstanceOf(QueryClient)
  })
})

describe('createQueryKey', () => {
  it('gera a mesma key para os mesmos argumentos', () => {
    const first = createQueryKey('home', 'highlights', { page: 1 })
    const second = createQueryKey('home', 'highlights', { page: 1 })

    expect(first).toEqual(second)
    expect(first).toEqual(['home', 'highlights', { page: 1 }])
  })

  it('não colide quando os params são diferentes', () => {
    const pageOne = createQueryKey('home', 'highlights', { page: 1 })
    const pageTwo = createQueryKey('home', 'highlights', { page: 2 })

    expect(pageOne).not.toEqual(pageTwo)
  })
})
