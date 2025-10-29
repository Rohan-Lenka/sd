import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { Content } from 'src/schemas/content.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';
import { ModifyQuery } from '@nest-extended/core/common/decorators/ModifyQuery.decorator';
import {
  SetOrganisation,
  SetOrganisationQuery,
} from '../../decorators/SetOrganisation';
import { ContentTypes } from './constants/ContentTypes';
import { formfield_UpdateDTO } from '../formfields/dto/formfield.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  async find(@ModifyQuery(SetOrganisationQuery()) query: Record<string, any>) {
    return await this.contentService.find(query);
  }

  @Get('/:id?')
  async get(
    @ModifyQuery(SetOrganisationQuery()) query: Record<string, any>,
    @Param('id') id: string,
  ) {
    return await this.contentService._get(id, query);
  }

  @Post()
  async create(
    @ModifyBody([setCreatedBy(), SetOrganisation()]) createContentDto: Content,
  ) {
    return await this.contentService._create(createContentDto);
  }

  @Post('/event')
  async createEvent(
    @ModifyBody([setCreatedBy(), SetOrganisation()]) createEventDTO: Content,
  ) {
    try {
      createEventDTO.type = ContentTypes.EVENT;
      return await this.contentService.createEvent(createEventDTO);
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  @Get('event/:id')
  async getEvent(@Param('id') id: string) {
    try {
      return await this.contentService.getEvent(id);
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  @Patch('event/:id')
  async updateEvent(
    @Body() updateEventDTO: Partial<Content>,
    @Param('id') id: string,
  ) {
    return await this.contentService._patch(id, updateEventDTO);
  }

  @Get('publish/:id')
  async publishContent(@Param('id') id: string) {
    return await this.contentService.handleContentPublish(id);
  }

  @Patch('/:id?')
  async patch(
    @ModifyQuery(SetOrganisationQuery()) query,
    @Body() patchContentDto: Partial<Content>,
    @Param('id') id,
  ) {
    return await this.contentService._patch(id, patchContentDto, query);
  }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.contentService._remove(id, query, user);
  }
}
