import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../../shared/decorators/current-user.decorator';
import { {ModuleName}Service } from '../application/{module-name}.service';
import { Create{ModuleName}Dto } from './dto/create-{module-name}.dto';
import { {ModuleName}ResponseDto } from './dto/{module-name}-response.dto';

@ApiTags('{ModuleName}')
@ApiBearerAuth('JWT')
@Controller('{module-name}')
export class {ModuleName}Controller {
  constructor(private readonly {moduleName}Service: {ModuleName}Service) {}

  @Post()
  @ApiOperation({ summary: 'TODO: describe this operation' })
  @ApiResponse({ status: 201, type: {ModuleName}ResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: Create{ModuleName}Dto,
  ): Promise<{ModuleName}ResponseDto> {
    return this.{moduleName}Service.create(user.sub, dto);
  }
}
