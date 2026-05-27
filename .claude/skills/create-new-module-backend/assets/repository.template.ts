import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  {ModuleName}Record,
  Create{ModuleName}Data,
  I{ModuleName}Repository,
} from '../domain/repositories/{module-name}.repository.interface';
import { {ModuleName}Mapper } from './{module-name}.mapper';

@Injectable()
export class {ModuleName}Repository implements I{ModuleName}Repository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: Create{ModuleName}Data): Promise<{ModuleName}Record> {
    const record = await this.prisma.{moduleName}.create({
      data: {
        userId: data.userId,
        // TODO: map remaining fields
      },
    });

    return {ModuleName}Mapper.toDomain(record);
  }
}
