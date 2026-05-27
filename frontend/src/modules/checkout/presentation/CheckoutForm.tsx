'use client'

import { useState } from 'react'
import { CheckoutItem, CheckoutResult } from '../domain/checkout.types'
import { calculateCheckout } from '../domain/checkout.calculator'
import { processCheckout } from '../application/checkout.service'
import CheckoutResultComponent from './CheckoutResult'
import { ApiError } from '@/shared/http/http-client'

const emptyItem = (): CheckoutItem => ({ name: '', unitPrice: 0, quantity: 1 })

export default function CheckoutForm() {
  const [items, setItems] = useState<CheckoutItem[]>([emptyItem()])
  const [result, setResult] = useState<CheckoutResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const preview = calculateCheckout(items.filter((i) => i.name && i.unitPrice > 0))

  function updateItem(index: number, field: keyof CheckoutItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()])
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    const validItems = items.filter((i) => i.name && i.unitPrice > 0 && i.quantity >= 1)
    if (validItems.length === 0) {
      setError('Add at least one item with a name, price, and quantity.')
      setLoading(false)
      return
    }

    try {
      const data = await processCheckout(validItems)
      setResult(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Item name</label>}
                <input
                  type="text"
                  placeholder="e.g. T-Shirt"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="w-28">
                {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Unit price</label>}
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={item.unitPrice || ''}
                  onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="w-20">
                {index === 0 && <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>}
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mb-0.5 text-gray-400 hover:text-red-500 text-lg leading-none"
                  aria-label="Remove item"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="text-sm text-indigo-600 hover:underline"
        >
          + Add item
        </button>

        {preview.subtotal > 0 && (
          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>${preview.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Taxes (13%)</span><span>${preview.taxes.toFixed(2)}</span></div>
            {preview.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount (10%)</span><span>−${preview.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-1"><span>Total</span><span>${preview.total.toFixed(2)}</span></div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Processing…' : 'Process checkout'}
        </button>
      </form>

      {result && <CheckoutResultComponent result={result} />}
    </div>
  )
}
