import { Module } from '@nestjs/common';
import { CheckoutService } from './application/checkout.service';
import {
  CHECKOUT_REPOSITORY,
} from './domain/repositories/checkout.repository.interface';
import { CheckoutRepository } from './infrastructure/checkout.repository';
import { CheckoutController } from './presentation/checkout.controller';

@Module({
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    { provide: CHECKOUT_REPOSITORY, useClass: CheckoutRepository },
  ],
})
export class CheckoutModule {}
