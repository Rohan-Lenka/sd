import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PlatformconfigService } from './platformconfig.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { Platformconfig } from 'src/schemas/platformconfig.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';

@Controller('platformConfig')
export class PlatformconfigController {
  constructor(private readonly platformconfigService: PlatformconfigService) {}

  @Get()
  async find(@Query() query: Record<string, any>) {
    return await this.platformconfigService._find(query);
  }

  @Get('/:id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.platformconfigService._get(id, query);
  }

  @Post()
  async create(
    @ModifyBody(setCreatedBy()) createPlatformconfigDto: Platformconfig,
  ) {
    return await this.platformconfigService._create(createPlatformconfigDto);
  }

  @Patch('/:id?')
  async patch(
    @Query() query,
    @Body() patchPlatformconfigDto: Partial<Platformconfig>,
    @Param('id') id,
  ) {
    return await this.platformconfigService._patch(
      id,
      patchPlatformconfigDto,
      query,
    );
  }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.platformconfigService._remove(id, query, user);
  }
}
