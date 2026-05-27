'use client'

import { create } from 'zustand'
import { calculateCheckout } from '@/modules/checkout/domain/checkout.calculator'
import { processCheckout } from '@/modules/checkout/application/checkout.service'
import type { CheckoutItem, CheckoutResult, CheckoutTotals } from '@/modules/checkout/domain/checkout.types'
import { ApiError } from '@/shared/http/http-client'

const emptyItem = (): CheckoutItem => ({ name: '', unitPrice: 0, quantity: 1 })

const emptyPreview = (): CheckoutTotals => ({ subtotal: 0, taxes: 0, discount: 0, total: 0 })

function computePreview(items: CheckoutItem[]): CheckoutTotals {
  const valid = items.filter((i) => i.name && i.unitPrice > 0)
  return valid.length > 0 ? calculateCheckout(valid) : emptyPreview()
}

interface CheckoutFormState {
  items: CheckoutItem[]
  preview: CheckoutTotals
  result: CheckoutResult | null
  isLoading: boolean
  formError: string | null

  addItem: () => void
  removeItem: (index: number) => void
  updateItem: (index: number, field: keyof CheckoutItem, value: string | number) => void
  submit: () => Promise<boolean>
  resetForm: () => void
}

export const useCheckoutFormStore = create<CheckoutFormState>()((set, get) => ({
  items: [emptyItem()],
  preview: emptyPreview(),
  result: null,
  isLoading: false,
  formError: null,

  addItem: () => {
    const items = [...get().items, emptyItem()]
    set({ items, preview: computePreview(items) })
  },

  removeItem: (index) => {
    const items = get().items.filter((_, i) => i !== index)
    set({ items, preview: computePreview(items) })
  },

  updateItem: (index, field, value) => {
    const items = get().items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    )
    set({ items, preview: computePreview(items) })
  },

  submit: async () => {
    const validItems = get().items.filter(
      (i) => i.name && i.unitPrice > 0 && i.quantity >= 1,
    )

    if (validItems.length === 0) {
      set({ formError: 'Add at least one item with a name, price, and quantity.' })
      return false
    }

    set({ isLoading: true, formError: null, result: null })
    try {
      const result = await processCheckout(validItems)
      set({ result })
      return true
    } catch (err) {
      set({ formError: err instanceof ApiError ? err.message : 'Something went wrong' })
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  resetForm: () =>
    set({ items: [emptyItem()], preview: emptyPreview(), result: null, formError: null }),
}))
