import { NextResponse } from 'next/server'
import { handleSimulatedHighlightsRequest } from '@/modules/home/api/simulated-highlights'

export async function GET() {
  const result = handleSimulatedHighlightsRequest({
    method: 'GET',
    pathname: '/api/home/highlights',
  })

  return NextResponse.json(result.body, { status: result.status })
}
