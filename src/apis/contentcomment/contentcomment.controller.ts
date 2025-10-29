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
import { ContentcommentService } from './contentcomment.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { Contentcomment } from 'src/schemas/contentcomment.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';

@Controller('contentComment')
export class ContentcommentController {
  constructor(private readonly contentcommentService: ContentcommentService) {}

  @Get('/content/:contentId')
  async find(
    @Param('contentId') contentId: string,
    @Query() query: Record<string, any>,
  ) {
    return await this.contentcommentService.findCommentsofContent(
      contentId,
      query,
    );
  }

  @Get('/:id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.contentcommentService._get(id, query);
  }

  @Post()
  async create(
    @ModifyBody(setCreatedBy()) createContentcommentDto: Contentcomment,
  ) {
    return await this.contentcommentService._create(createContentcommentDto);
  }

  @Patch('/:id?')
  async patch(
    @Query() query,
    @Body() patchContentcommentDto: Partial<Contentcomment>,
    @Param('id') id,
  ) {
    return await this.contentcommentService._patch(
      id,
      patchContentcommentDto,
      query,
    );
  }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.contentcommentService._remove(id, query, user);
  }
}
