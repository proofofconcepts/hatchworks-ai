import { Inject, Injectable } from '@nestjs/common';
import { calculateCheckout } from '../domain/checkout.calculator';
import {
  CHECKOUT_REPOSITORY,
  CheckoutRecord,
  ICheckoutRepository,
} from '../domain/repositories/checkout.repository.interface';
import { CreateCheckoutDto } from '../presentation/dto/create-checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    @Inject(CHECKOUT_REPOSITORY)
    private readonly checkoutRepository: ICheckoutRepository,
  ) {}

  async processCheckout(userId: string, dto: CreateCheckoutDto): Promise<CheckoutRecord> {
    const totals = calculateCheckout(dto.items);

    return this.checkoutRepository.save({
      userId,
      ...totals,
      items: dto.items.map((item) => ({
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: Math.round(item.unitPrice * item.quantity * 100) / 100,
      })),
    });
  }
}
