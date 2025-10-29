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
import { MicrosoftUsersService } from './microsoftUsers.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { MicrosoftUsers } from 'src/schemas/microsoftUsers.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';

@Controller('microsoft-users')
export class MicrosoftUsersController {
  constructor(private readonly microsoftUsersService: MicrosoftUsersService) {}

  @Get()
  async find(@Query() query: Record<string, any>) {
    return await this.microsoftUsersService._find(query);
  }

  @Get('/:id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.microsoftUsersService._get(id, query);
  }

  @Post()
  async create(
    @ModifyBody(setCreatedBy()) createMicrosoftUsersDto: MicrosoftUsers,
  ) {
    return await this.microsoftUsersService._create(createMicrosoftUsersDto);
  }

  @Patch('/:id?')
  async patch(
    @Query() query,
    @Body() patchMicrosoftUsersDto: Partial<MicrosoftUsers>,
    @Param('id') id,
  ) {
    return await this.microsoftUsersService._patch(
      id,
      patchMicrosoftUsersDto,
      query,
    );
  }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.microsoftUsersService._remove(id, query, user);
  }
}
