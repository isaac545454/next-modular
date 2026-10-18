'use client'

import { BulletList } from '@/shared/ui/BulletList'
import { Card } from '@/shared/ui/Card'

const loginSteps = [
  'POST /api/auth/login na origem da SPA',
  'Set-Cookie: tlc_session HttpOnly',
  'emite auth.signedIn — o shell navega ao checkout',
]

export function AuthSteps() {
  return (
    <Card as="aside">
      <p className="m-0 text-sm font-semibold text-tlc-navy">O que o login faz</p>
      <BulletList items={loginSteps} />
    </Card>
  )
}
