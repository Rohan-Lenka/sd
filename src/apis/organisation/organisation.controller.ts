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
import { OrganisationService } from './organisation.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { Organisation } from 'src/schemas/organisation.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';

@Controller('organisation')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Get()
  async find(@Query() query: Record<string, any>) {
    return await this.organisationService._find(query);
  }

  @Get('/:id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.organisationService._get(id, query);
  }

  @Post()
  async create(
    @ModifyBody(setCreatedBy()) createOrganisationDto: Organisation,
  ) {
    return await this.organisationService._create(createOrganisationDto);
  }

  @Patch('/:id?')
  async patch(
    @Query() query,
    @Body() patchOrganisationDto: Partial<Organisation>,
    @Param('id') id,
  ) {
    return await this.organisationService._patch(
      id,
      patchOrganisationDto,
      query,
    );
  }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.organisationService._remove(id, query, user);
  }
}
