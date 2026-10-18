import { useSignedInUserId } from '@/shared/frontend-events'
import {
  SIMULATED_AUTH_EMAIL,
  SIMULATED_AUTH_USER_ID,
} from '../../credentials'

export function useAccountPage() {
  const userId = useSignedInUserId()

  return {
    userId,
    simulatedEmail: SIMULATED_AUTH_EMAIL,
    simulatedUserId: SIMULATED_AUTH_USER_ID,
  }
}
