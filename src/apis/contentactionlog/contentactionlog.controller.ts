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
import { ContentactionlogService } from './contentactionlog.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { Contentactionlog } from 'src/schemas/contentactionlog.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';

@Controller('ContentActionLog')
export class ContentactionlogController {
  constructor(
    private readonly contentactionlogService: ContentactionlogService,
  ) {}

  @Get()
  async find(@Query() query: Record<string, any>) {
    return await this.contentactionlogService._find(query);
  }

  @Get('/:id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.contentactionlogService._get(id, query);
  }

  @Post()
  async create(
    @ModifyBody(setCreatedBy()) createContentactionlogDto: Contentactionlog,
  ) {
    return await this.contentactionlogService._create(
      createContentactionlogDto,
    );
  }

  @Patch('/:id?')
  async patch(
    @Query() query,
    @Body() patchContentactionlogDto: Partial<Contentactionlog>,
    @Param('id') id,
  ) {
    return await this.contentactionlogService._patch(
      id,
      patchContentactionlogDto,
      query,
    );
  }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.contentactionlogService._remove(id, query, user);
  }
}
