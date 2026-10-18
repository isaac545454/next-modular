'use client'

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { queryClient as defaultQueryClient } from '@/shared/query'
import { bootstrapModules } from './bootstrap-modules'

type ProvidersProps = {
  children: ReactNode
  queryClient?: QueryClient
}

function ModulesProvider({ children }: { children: ReactNode }) {
  useState(() => bootstrapModules())
  return <>{children}</>
}

export function Providers({
  children,
  queryClient = defaultQueryClient,
}: ProvidersProps) {
  return (
    <ModulesProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ModulesProvider>
  )
}
