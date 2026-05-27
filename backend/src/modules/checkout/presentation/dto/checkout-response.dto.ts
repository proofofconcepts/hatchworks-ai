import { ApiProperty } from '@nestjs/swagger';

export class CheckoutResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  taxes: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  createdAt: Date;
}
