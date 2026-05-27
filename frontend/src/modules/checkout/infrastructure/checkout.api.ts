import { apiRequest } from '@/shared/http/http-client'
import { CheckoutRequest, CheckoutResult } from '../domain/checkout.types'

export async function processCheckoutApi(data: CheckoutRequest): Promise<CheckoutResult> {
  return apiRequest<CheckoutResult>('/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
