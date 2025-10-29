import {
  BadRequestException,
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
import { ContentworkflowService } from './contentworkflow.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
//import { ModifyBody, setCreatedBy } from '@nest-extended/core/common/decorators/ModifyBody.decorator';
import {
  CreateContentworkflowDTO,
  createContentWorkflowValidation,
} from './dto/contentworkflow.dto';
import { Users } from 'src/schemas/users.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';

@Controller('contentWorkflow')
export class ContentworkflowController {
  constructor(
    private readonly contentworkflowService: ContentworkflowService,
  ) {}

  @Post('approve/:id')
  async approveContent(
    @Param('id') id: string,
    @ModifyBody(setCreatedBy()) body: { createdBy: string },
  ) {
    try {
      return await this.contentworkflowService.approveContent(
        id,
        body.createdBy,
      );
    } catch (error) {
      return { message: error };
    }
  }

  @Get()
  async find(@Query() query: Record<string, any>) {
    return await this.contentworkflowService._find(query);
  }

  @Get('/:id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.contentworkflowService._get(id, query);
  }

  @Post()
  async create(
    @Body() createContentWorkflowPayload: CreateContentworkflowDTO,
    @User() user: Users,
  ) {
    //
    try {
      const parsedPayload = createContentWorkflowValidation.parse(
        createContentWorkflowPayload,
      );
      if (!parsedPayload || !parsedPayload.workflow || !parsedPayload.content)
        throw new BadRequestException('Invalid request payload');

      return await this.contentworkflowService.createContentWorkflow(
        parsedPayload.workflow,
        parsedPayload.content,
        user._id.toString(),
      );
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException(error.message);
    }
  }

  // @Patch('/:id?')
  // async patch(
  //   @Query() query,
  //   @Body() patchContentworkflowDto: Partial<contentWorkflow>,
  //   @Param('id') id,
  // ) {
  //   return await this.contentworkflowService._patch(id, patchContentworkflowDto, query);
  // }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.contentworkflowService._remove(id, query, user);
  }
}
