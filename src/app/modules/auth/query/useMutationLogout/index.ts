import { useMutation } from '@tanstack/react-query'
import { logout } from '../../service/session'

export function useMutationLogout() {
  return useMutation({
    mutationFn: logout,
  })
}
