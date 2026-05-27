import type { CheckoutResult } from '../domain/checkout.types'

interface Props {
  result: CheckoutResult
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-2 ${bold ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  )
}

export default function CheckoutResult({ result }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>

      <div className="divide-y divide-gray-100">
        <Row label="Subtotal" value={result.subtotal} />
        <Row label="Taxes (13%)" value={result.taxes} />
        {result.discount > 0 && <Row label="Discount (10%)" value={-result.discount} />}
        <Row label="Total" value={result.total} bold />
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Order ID: {result.id}
      </p>
    </div>
  )
}
