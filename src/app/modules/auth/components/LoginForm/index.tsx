'use client'

import { StatusMessage } from '@/shared/ui/StatusMessage'
import { Button } from '@/shared/ui/Button'
import { fieldClass, inputClass } from '@/shared/ui/classes'
import { useLoginForm } from './useLoginForm'

export function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errorMessage,
    pending,
    handleSubmit,
  } = useLoginForm()

  return (
    <form className="grid max-w-md gap-3.5" onSubmit={(event) => void handleSubmit(event)}>
      <label className={fieldClass}>
        E-mail
        <input
          className={inputClass}
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className={fieldClass}>
        Senha
        <input
          className={inputClass}
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {errorMessage ? <StatusMessage tone="error">{errorMessage}</StatusMessage> : null}
      <Button type="submit" disabled={pending}>
        Entrar
      </Button>
    </form>
  )
}
