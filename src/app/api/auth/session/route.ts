import { handleSimulatedAuthRequest } from '@/modules/auth/api/simulated-auth-handler'
import { toAuthResponse } from '../_to-response'

export async function GET(request: Request) {
  return toAuthResponse(
    handleSimulatedAuthRequest({
      method: 'GET',
      pathname: '/api/auth/session',
      cookieHeader: request.headers.get('cookie') ?? undefined,
    }),
  )
}
