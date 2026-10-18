import { useMutation } from '@tanstack/react-query'
import { login } from '../../service/session'

type LoginInput = {
  email: string
  password: string
}

export function useMutationLogin() {
  return useMutation({
    mutationFn: ({ email, password }: LoginInput) => login(email, password),
  })
}
