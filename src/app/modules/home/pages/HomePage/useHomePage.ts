import { AppHttpError } from '@/shared/http'
import { useSignedInUserId } from '@/shared/frontend-events'
import { useQueryHighlights } from '../../query/useQueryHighlights'

export function useHomePage() {
  const userId = useSignedInUserId()
  const highlightsQuery = useQueryHighlights()

  const errorMessage =
    highlightsQuery.error instanceof AppHttpError
      ? highlightsQuery.error.message
      : 'Não foi possível carregar os destaques.'

  return {
    userId,
    isPending: highlightsQuery.isPending,
    isError: highlightsQuery.isError,
    isSuccess: highlightsQuery.isSuccess,
    highlights: highlightsQuery.data ?? [],
    errorMessage,
    refetch: () => {
      void highlightsQuery.refetch()
    },
  }
}
