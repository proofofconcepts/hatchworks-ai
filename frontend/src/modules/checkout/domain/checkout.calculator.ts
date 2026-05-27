import { CheckoutItem, CheckoutTotals } from './checkout.types'

const TAX_RATE = 0.13
const DISCOUNT_RATE = 0.1
const DISCOUNT_THRESHOLD = 100

function round(value: number): number {
  return Math.round(value * 100) / 100
}

export function calculateCheckout(items: CheckoutItem[]): CheckoutTotals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const taxes = subtotal * TAX_RATE
  const discount = subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0
  const total = subtotal + taxes - discount

  return {
    subtotal: round(subtotal),
    taxes: round(taxes),
    discount: round(discount),
    total: round(total),
  }
}
