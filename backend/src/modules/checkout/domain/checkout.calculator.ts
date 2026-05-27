export interface CheckoutItemInput {
  unitPrice: number;
  quantity: number;
}

export interface CheckoutTotals {
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
}

const TAX_RATE = 0.13;
const DISCOUNT_RATE = 0.10;
const DISCOUNT_THRESHOLD = 100;

export function calculateCheckout(items: CheckoutItemInput[]): CheckoutTotals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const taxes = subtotal * TAX_RATE;
  const discount = subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
  const total = subtotal + taxes - discount;

  return {
    subtotal: round(subtotal),
    taxes: round(taxes),
    discount: round(discount),
    total: round(total),
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
