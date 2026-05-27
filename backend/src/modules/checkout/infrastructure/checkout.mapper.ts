import { Checkout, CheckoutItem } from '@prisma/client';
import { CheckoutRecord } from '../domain/repositories/checkout.repository.interface';

type CheckoutWithItems = Checkout & { items: CheckoutItem[] };

export class CheckoutMapper {
  static toDomain(raw: CheckoutWithItems): CheckoutRecord {
    return {
      id: raw.id,
      userId: raw.userId,
      subtotal: Number(raw.subtotal),
      taxes: Number(raw.taxes),
      discount: Number(raw.discount),
      total: Number(raw.total),
      createdAt: raw.createdAt,
      items: raw.items.map((item) => ({
        id: item.id,
        name: item.name,
        unitPrice: Number(item.unitPrice),
        quantity: item.quantity,
        lineTotal: Number(item.lineTotal),
      })),
    };
  }
}
