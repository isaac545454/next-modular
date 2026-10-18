import { describe, expect, it } from 'vitest'
import { listModulePaths, type ModuleRoute } from '.'

describe('listModulePaths', () => {
  it('concatena os paths publicados pelos módulos', () => {
    const home: ModuleRoute[] = [{ path: '/' }, { path: '/arquitetura' }]
    const auth: ModuleRoute[] = [{ path: '/login' }]

    expect(listModulePaths(home, auth)).toEqual(['/', '/arquitetura', '/login'])
  })
})
