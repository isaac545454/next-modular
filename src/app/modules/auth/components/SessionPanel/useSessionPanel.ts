import { useMutationLogout } from '../../query/useMutationLogout'

export function useSessionPanel() {
  const logoutMutation = useMutationLogout()

  return {
    logout: () => {
      void logoutMutation.mutateAsync()
    },
    pending: logoutMutation.isPending,
  }
}
