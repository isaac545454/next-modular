import { NextResponse } from 'next/server'
import type { SimulatedAuthResponse } from '@/modules/auth/api/simulated-auth-handler'

export function toAuthResponse(result: SimulatedAuthResponse) {
  const headers = new Headers()
  if (result.setCookie) {
    headers.set('Set-Cookie', result.setCookie)
  }

  if (result.status === 204) {
    return new NextResponse(null, { status: 204, headers })
  }

  headers.set('Content-Type', 'application/json')
  return NextResponse.json(result.body, { status: result.status, headers })
}
