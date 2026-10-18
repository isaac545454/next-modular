import { httpClient } from '@/shared/http'
import {
  HIGHLIGHTS_API_BASE_URL,
  HIGHLIGHTS_PATH,
} from '../../api/simulated-highlights'

export type Highlight = {
  id: string
  title: string
  summary?: string
  level?: string
  hours?: string
  priceLabel?: string
  audience?: string
  syllabus?: string[]
}

export async function fetchHighlights(): Promise<Highlight[]> {
  const { data } = await httpClient.get<Highlight[] | { items?: Highlight[] }>(
    HIGHLIGHTS_PATH,
    { baseURL: HIGHLIGHTS_API_BASE_URL },
  )

  if (Array.isArray(data)) {
    return data
  }

  return data.items ?? []
}

export async function fetchHighlightById(id: string): Promise<Highlight | null> {
  const items = await fetchHighlights()
  return items.find((item) => item.id === id) ?? null
}
