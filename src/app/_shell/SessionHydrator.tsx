'use client'

import { useEffect } from 'react'
import { hydrateSession } from '@/modules/auth'

export function SessionHydrator() {
  useEffect(() => {
    void hydrateSession()
  }, [])

  return null
}
