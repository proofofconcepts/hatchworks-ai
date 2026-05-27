import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../../shared/decorators/current-user.decorator';
import { CheckoutService } from '../application/checkout.service';
import { CheckoutResponseDto } from './dto/checkout-response.dto';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@ApiTags('Checkout')
@ApiBearerAuth('JWT')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @ApiOperation({ summary: 'Process a checkout and return calculated totals' })
  @ApiResponse({ status: 201, type: CheckoutResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  processCheckout(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCheckoutDto,
  ): Promise<CheckoutResponseDto> {
    return this.checkoutService.processCheckout(user.sub, dto);
  }
}
