import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CheckoutItemDto {
  @ApiProperty({ example: 'T-Shirt' })
  @IsString()
  name: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
