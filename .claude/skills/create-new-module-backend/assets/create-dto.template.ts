import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Create{ModuleName}Dto {
  // TODO: replace with the actual fields for this module.
  // Use class-validator decorators for validation and @ApiProperty for Swagger.

  @ApiProperty({ example: 'example value' })
  @IsString()
  exampleField: string;
}
