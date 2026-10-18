import { useParams } from 'next/navigation'
import { AppHttpError } from '@/shared/http'
import { useSignedInUserId } from '@/shared/frontend-events'
import { useQueryHighlight } from '../../query/useQueryHighlight'

export function useCoursePage() {
  const params = useParams<{ courseId?: string }>()
  const courseId = params?.courseId ?? ''
  const userId = useSignedInUserId()
  const courseQuery = useQueryHighlight(courseId)

  const errorMessage =
    courseQuery.error instanceof AppHttpError
      ? courseQuery.error.message
      : 'Não foi possível carregar este curso.'

  return {
    userId,
    isPending: courseQuery.isPending,
    isError: courseQuery.isError,
    course: courseQuery.data ?? null,
    errorMessage,
    refetch: () => {
      void courseQuery.refetch()
    },
  }
}
