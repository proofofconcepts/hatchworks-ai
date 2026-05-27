'use client'

import { create } from 'zustand'
import { processCheckout } from '@/modules/checkout/application/checkout.service'
import type { CheckoutItem, CheckoutResult } from '@/modules/checkout/domain/checkout.types'
import { ApiError } from '@/shared/http/http-client'

const emptyItem = (): CheckoutItem => ({ name: '', unitPrice: 0, quantity: 1 })

interface CheckoutFormState {
  items: CheckoutItem[]
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
  result: null,
  isLoading: false,
  formError: null,

  addItem: () => set((s) => ({ items: [...s.items, emptyItem()] })),

  removeItem: (index) =>
    set((s) => ({ items: s.items.filter((_, i) => i !== index) })),

  updateItem: (index, field, value) =>
    set((s) => ({
      items: s.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    })),

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

  resetForm: () => set({ items: [emptyItem()], result: null, formError: null }),
}))
