// Import the generated Prisma model type for this module
// import { {ModuleName} } from '@prisma/client';
import { {ModuleName}Record } from '../domain/repositories/{module-name}.repository.interface';

export class {ModuleName}Mapper {
  // TODO: replace `any` with the Prisma-generated model type once the schema is defined
  static toDomain(raw: any): {ModuleName}Record {
    return {
      id: raw.id,
      userId: raw.userId,
      createdAt: raw.createdAt,
      // TODO: map remaining fields, converting Decimal → Number where needed
    };
  }
}
