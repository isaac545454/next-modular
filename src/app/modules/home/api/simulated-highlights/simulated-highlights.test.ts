import { describe, expect, it } from 'vitest'
import { fetchHighlightById, fetchHighlights } from '../../service/highlights'
import {
  HIGHLIGHTS_PATH,
  SIMULATED_HIGHLIGHTS,
  handleSimulatedHighlightsRequest,
  isSimulatedHighlightsPath,
} from '.'

describe('simulated highlights', () => {
  it('reconhece só o caminho do catálogo', () => {
    expect(isSimulatedHighlightsPath(HIGHLIGHTS_PATH)).toBe(true)
    expect(isSimulatedHighlightsPath(`${HIGHLIGHTS_PATH}/`)).toBe(true)
    expect(isSimulatedHighlightsPath('/highlights')).toBe(false)
  })

  it('responde GET com a trilha de exemplo', () => {
    const result = handleSimulatedHighlightsRequest({
      method: 'GET',
      pathname: HIGHLIGHTS_PATH,
    })

    expect(result.status).toBe(200)
    expect(result.body).toEqual(SIMULATED_HIGHLIGHTS)
    expect(SIMULATED_HIGHLIGHTS[0]?.title).toBe('Trilha Frontend Modular')
  })

  it('rejeita método que não seja GET', () => {
    const result = handleSimulatedHighlightsRequest({
      method: 'POST',
      pathname: HIGHLIGHTS_PATH,
    })

    expect(result.status).toBe(404)
  })

  it('fetchHighlights lê o array simulado pelo adapter de teste', async () => {
    const items = await fetchHighlights()

    expect(items.length).toBeGreaterThan(0)
    expect(items.some((item) => item.title === 'Turma aberta')).toBe(false)
    expect(items[0]).toMatchObject({ id: 'trilha-frontend' })
  })

  it('busca um destaque pelo id', async () => {
    const found = await fetchHighlightById('trilha-frontend')
    const missing = await fetchHighlightById('nao-existe')

    expect(found).toMatchObject({ id: 'trilha-frontend', title: 'Trilha Frontend Modular' })
    expect(missing).toBeNull()
  })
})
