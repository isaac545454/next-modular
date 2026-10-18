export { authRoutes } from './routes'

export const authNav = [{ label: 'Entrar', path: '/login' }]

export { hydrateSession, login, logout } from './service/session'
