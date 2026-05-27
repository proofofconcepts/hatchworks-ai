export interface CreateCheckoutData {
  userId: string;
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  items: {
    name: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
}

export interface CheckoutRecord {
  id: string;
  userId: string;
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  createdAt: Date;
  items: {
    id: string;
    name: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
}

export const CHECKOUT_REPOSITORY = Symbol('ICheckoutRepository');

export interface ICheckoutRepository {
  save(data: CreateCheckoutData): Promise<CheckoutRecord>;
}
