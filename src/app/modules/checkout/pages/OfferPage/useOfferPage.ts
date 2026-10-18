import { checkoutOffer } from '../../service/offer'

export function useOfferPage() {
  return { offer: checkoutOffer }
}
