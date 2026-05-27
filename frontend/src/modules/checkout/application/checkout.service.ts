import { processCheckoutApi } from '../infrastructure/checkout.api'
import { CheckoutItem, CheckoutResult } from '../domain/checkout.types'

export async function processCheckout(items: CheckoutItem[]): Promise<CheckoutResult> {
  return processCheckoutApi({ items })
}
