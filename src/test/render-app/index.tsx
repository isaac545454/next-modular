'use client'

import { QueryClient } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { useMemo, useState, type ReactNode } from 'react'
import { AppLayout } from '@/app/_shell/AppLayout'
import { EventRedirects } from '@/app/_shell/event-redirects'
import { NotFoundPage } from '@/app/_shell/NotFoundPage'
import { Providers } from '@/app/_shell/providers'
import { AuthLayout } from '@/modules/auth/layouts/AuthLayout'
import { AccountPage } from '@/modules/auth/pages/AccountPage'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { SessionGuidePage } from '@/modules/auth/pages/SessionGuidePage'
import { CheckoutLayout } from '@/modules/checkout/layouts/CheckoutLayout'
import { CheckoutPage } from '@/modules/checkout/pages/CheckoutPage'
import { OfferPage } from '@/modules/checkout/pages/OfferPage'
import { OrdersPage } from '@/modules/checkout/pages/OrdersPage'
import { HomeLayout } from '@/modules/home/layouts/HomeLayout'
import { ArchitecturePage } from '@/modules/home/pages/ArchitecturePage'
import { CoursePage } from '@/modules/home/pages/CoursePage'
import { HomePage } from '@/modules/home/pages/HomePage'
import { PaymentLayout } from '@/modules/payment/layouts/PaymentLayout'
import { PaymentPage } from '@/modules/payment/pages/PaymentPage'
import { ReceiptPage } from '@/modules/payment/pages/ReceiptPage'
import { SandboxPage } from '@/modules/payment/pages/SandboxPage'
import { TestNavContext } from '../next-navigation'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
}

function normalizePath(href: string) {
  const path = href.split('?')[0] ?? href
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path || '/'
}

function matchRoute(pathname: string): ReactNode {
  if (pathname === '/') {
    return (
      <HomeLayout>
        <HomePage />
      </HomeLayout>
    )
  }

  if (pathname === '/arquitetura') {
    return (
      <HomeLayout>
        <ArchitecturePage />
      </HomeLayout>
    )
  }

  if (pathname.startsWith('/cursos/')) {
    return (
      <HomeLayout>
        <CoursePage />
      </HomeLayout>
    )
  }

  if (pathname === '/login') {
    return (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    )
  }

  if (pathname === '/conta') {
    return (
      <AuthLayout>
        <AccountPage />
      </AuthLayout>
    )
  }

  if (pathname === '/sessao') {
    return (
      <AuthLayout>
        <SessionGuidePage />
      </AuthLayout>
    )
  }

  if (pathname === '/checkout') {
    return (
      <CheckoutLayout>
        <CheckoutPage />
      </CheckoutLayout>
    )
  }

  if (pathname === '/checkout/oferta') {
    return (
      <CheckoutLayout>
        <OfferPage />
      </CheckoutLayout>
    )
  }

  if (pathname === '/checkout/pedidos') {
    return (
      <CheckoutLayout>
        <OrdersPage />
      </CheckoutLayout>
    )
  }

  if (pathname === '/payment') {
    return (
      <PaymentLayout>
        <PaymentPage />
      </PaymentLayout>
    )
  }

  if (pathname === '/payment/recibo') {
    return (
      <PaymentLayout>
        <ReceiptPage />
      </PaymentLayout>
    )
  }

  if (pathname === '/payment/sandbox') {
    return (
      <PaymentLayout>
        <SandboxPage />
      </PaymentLayout>
    )
  }

  return <NotFoundPage />
}

type TestAppProps = {
  initialPath?: string
  queryClient?: QueryClient
}

export function App({
  initialPath = '/',
  queryClient = createTestQueryClient(),
}: TestAppProps) {
  const [pathname, setPathname] = useState(initialPath)
  const navigation = useMemo(
    () => ({
      pathname,
      push: (href: string) => setPathname(normalizePath(href)),
    }),
    [pathname],
  )

  return (
    <TestNavContext.Provider value={navigation}>
      <Providers queryClient={queryClient}>
        <EventRedirects />
        <AppLayout>{matchRoute(pathname)}</AppLayout>
      </Providers>
    </TestNavContext.Provider>
  )
}

type RenderAppOptions = {
  route?: string
  queryClient?: QueryClient
}

export function renderApp({
  route = '/',
  queryClient = createTestQueryClient(),
}: RenderAppOptions = {}) {
  const view = render(<App initialPath={route} queryClient={queryClient} />)
  return { ...view, queryClient }
}
