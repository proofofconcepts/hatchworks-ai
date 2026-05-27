import { Module } from '@nestjs/common';
import { {ModuleName}Service } from './application/{module-name}.service';
import { {MODULE_NAME}_REPOSITORY } from './domain/repositories/{module-name}.repository.interface';
import { {ModuleName}Repository } from './infrastructure/{module-name}.repository';
import { {ModuleName}Controller } from './presentation/{module-name}.controller';

@Module({
  controllers: [{ModuleName}Controller],
  providers: [
    {ModuleName}Service,
    { provide: {MODULE_NAME}_REPOSITORY, useClass: {ModuleName}Repository },
  ],
})
export class {ModuleName}Module {}
