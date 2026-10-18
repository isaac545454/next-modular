import { useSignedInUserId } from '@/shared/frontend-events'

export function useLoginPage() {
  const userId = useSignedInUserId()
  return { userId }
}
