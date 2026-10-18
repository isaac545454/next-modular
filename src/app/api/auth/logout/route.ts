import { handleSimulatedAuthRequest } from '@/modules/auth/api/simulated-auth-handler'
import { toAuthResponse } from '../_to-response'

export async function POST(request: Request) {
  return toAuthResponse(
    handleSimulatedAuthRequest({
      method: 'POST',
      pathname: '/api/auth/logout',
      cookieHeader: request.headers.get('cookie') ?? undefined,
    }),
  )
}
