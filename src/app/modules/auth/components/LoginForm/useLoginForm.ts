import { type FormEvent, useState } from 'react'
import { AppHttpError } from '@/shared/http'
import {
  SIMULATED_AUTH_EMAIL,
  SIMULATED_AUTH_PASSWORD,
} from '../../credentials'
import { useMutationLogin } from '../../query/useMutationLogin'

export function useLoginForm() {
  const loginMutation = useMutationLogin()
  const [email, setEmail] = useState(SIMULATED_AUTH_EMAIL)
  const [password, setPassword] = useState(SIMULATED_AUTH_PASSWORD)

  const errorMessage =
    loginMutation.error instanceof AppHttpError
      ? loginMutation.error.message
      : loginMutation.isError
        ? 'Não foi possível entrar.'
        : null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    loginMutation.reset()
    try {
      await loginMutation.mutateAsync({ email, password })
    } catch {
      // erro já está em loginMutation.error
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    errorMessage,
    pending: loginMutation.isPending,
    handleSubmit,
  }
}
