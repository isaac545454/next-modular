import { useQuery } from '@tanstack/react-query'
import { createQueryKey } from '@/shared/query'
import { fetchHighlights } from '../../service/highlights'

export function useQueryHighlights() {
  return useQuery({
    queryKey: createQueryKey('home', 'highlights'),
    queryFn: fetchHighlights,
  })
}
