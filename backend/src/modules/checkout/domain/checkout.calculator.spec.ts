import { calculateCheckout } from './checkout.calculator';

describe('calculateCheckout', () => {
  it('computes subtotal as sum of unit_price × quantity', () => {
    const result = calculateCheckout([
      { unitPrice: 10, quantity: 2 },
      { unitPrice: 5, quantity: 4 },
    ]);
    expect(result.subtotal).toBe(40);
  });

  it('always applies 13% tax on subtotal', () => {
    const result = calculateCheckout([{ unitPrice: 100, quantity: 1 }]);
    expect(result.taxes).toBe(13);
  });

  it('applies no discount when subtotal is exactly 100', () => {
    const result = calculateCheckout([{ unitPrice: 100, quantity: 1 }]);
    expect(result.discount).toBe(0);
  });

  it('applies 10% discount when subtotal exceeds 100', () => {
    const result = calculateCheckout([{ unitPrice: 60, quantity: 2 }]);
    expect(result.subtotal).toBe(120);
    expect(result.discount).toBe(12);
  });

  it('applies no discount when subtotal is below 100', () => {
    const result = calculateCheckout([{ unitPrice: 30, quantity: 3 }]);
    expect(result.subtotal).toBe(90);
    expect(result.discount).toBe(0);
  });

  it('computes total as subtotal + taxes - discount', () => {
    const result = calculateCheckout([{ unitPrice: 200, quantity: 1 }]);
    // subtotal=200, taxes=26, discount=20, total=206
    expect(result.total).toBe(206);
  });

  it('rounds values to 2 decimal places', () => {
    const result = calculateCheckout([{ unitPrice: 10.99, quantity: 3 }]);
    expect(result.subtotal).toBe(32.97);
    expect(result.taxes).toBe(4.29);
  });
});
