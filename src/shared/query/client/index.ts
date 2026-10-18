import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
})

export function createQueryKey(
  module: string,
  resource: string,
  params?: unknown,
): readonly [string, string, unknown?] {
  if (params === undefined) {
    return [module, resource]
  }

  return [module, resource, params]
}

export function invalidateResource(
  module: string,
  resource: string,
  params?: unknown,
) {
  return queryClient.invalidateQueries({
    queryKey: createQueryKey(module, resource, params),
  })
}
