import { Inject, Injectable } from '@nestjs/common';
import {
  {MODULE_NAME}_REPOSITORY,
  {ModuleName}Record,
  I{ModuleName}Repository,
} from '../domain/repositories/{module-name}.repository.interface';
import { Create{ModuleName}Dto } from '../presentation/dto/create-{module-name}.dto';

@Injectable()
export class {ModuleName}Service {
  constructor(
    @Inject({MODULE_NAME}_REPOSITORY)
    private readonly {moduleName}Repository: I{ModuleName}Repository,
  ) {}

  async create(userId: string, dto: Create{ModuleName}Dto): Promise<{ModuleName}Record> {
    // TODO: invoke domain logic here before persisting
    return this.{moduleName}Repository.save({
      userId,
      // TODO: map dto fields
    });
  }
}
