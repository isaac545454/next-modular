import { useQuery } from '@tanstack/react-query'
import { createQueryKey } from '@/shared/query'
import { fetchHighlightById } from '../../service/highlights'

export function useQueryHighlight(courseId: string) {
  return useQuery({
    queryKey: createQueryKey('home', 'highlight', { id: courseId }),
    queryFn: () => fetchHighlightById(courseId),
    enabled: courseId.length > 0,
  })
}
