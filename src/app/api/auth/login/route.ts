import { handleSimulatedAuthRequest } from '@/modules/auth/api/simulated-auth-handler'
import { toAuthResponse } from '../_to-response'

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined)
  return toAuthResponse(
    handleSimulatedAuthRequest({
      method: 'POST',
      pathname: '/api/auth/login',
      cookieHeader: request.headers.get('cookie') ?? undefined,
      body,
    }),
  )
}
