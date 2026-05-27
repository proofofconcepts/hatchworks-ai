'use client'

import { useCheckoutFormStore } from '@/shared/store/checkout-form.store'

export default function CheckoutForm() {
  const {
    items,
    preview,
    isLoading,
    formError,
    addItem,
    removeItem,
    updateItem,
    submit,
  } = useCheckoutFormStore()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await submit()
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

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing…' : 'Process checkout'}
        </button>
      </form>

      <CheckoutResultPanel />
    </div>
  )
}

function CheckoutResultPanel() {
  const result = useCheckoutFormStore((s) => s.result)
  if (!result) return null

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
      <div className="divide-y divide-gray-100">
        <ResultRow label="Subtotal" value={result.subtotal} />
        <ResultRow label="Taxes (13%)" value={result.taxes} />
        {result.discount > 0 && <ResultRow label="Discount (10%)" value={-result.discount} />}
        <ResultRow label="Total" value={result.total} bold />
      </div>
      <p className="mt-4 text-xs text-gray-400">Order ID: {result.id}</p>
    </div>
  )
}

function ResultRow({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-2 ${bold ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  )
}
