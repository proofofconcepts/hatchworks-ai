import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  CheckoutRecord,
  CreateCheckoutData,
  ICheckoutRepository,
} from '../domain/repositories/checkout.repository.interface';
import { CheckoutMapper } from './checkout.mapper';

@Injectable()
export class CheckoutRepository implements ICheckoutRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: CreateCheckoutData): Promise<CheckoutRecord> {
    const checkout = await this.prisma.checkout.create({
      data: {
        userId: data.userId,
        subtotal: data.subtotal,
        taxes: data.taxes,
        discount: data.discount,
        total: data.total,
        items: {
          create: data.items.map((item) => ({
            name: item.name,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          })),
        },
      },
      include: { items: true },
    });

    return CheckoutMapper.toDomain(checkout);
  }
}
