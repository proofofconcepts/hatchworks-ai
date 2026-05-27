export interface CheckoutItem {
  name: string
  unitPrice: number
  quantity: number
}

export interface CheckoutRequest {
  items: CheckoutItem[]
}

export interface CheckoutResult {
  id: string
  subtotal: number
  taxes: number
  discount: number
  total: number
  createdAt: string
}

export interface CheckoutTotals {
  subtotal: number
  taxes: number
  discount: number
  total: number
}
