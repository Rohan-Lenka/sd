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
import { WorkflowstateService } from './workflowstate.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { Workflowstate } from 'src/schemas/workflowstate.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';
import { Users } from 'src/schemas/users.schema';

@Controller('workflowState')
export class WorkflowstateController {
  constructor(private readonly workflowstateService: WorkflowstateService) {}

  @Get('/getPendingContent')
  async getUsers_withPending(@User() user: Users, @Query() query) {
    return this.workflowstateService.getContents_withPendingState(
      String(user._id),
      user.orgRole,
      query,
    );
  }

  @Get()
  async find(@Query() query: Record<string, any>) {
    return await this.workflowstateService._find(query);
  }

  @Get('/:id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.workflowstateService._get(id, query);
  }

  @Post()
  async create(
    @ModifyBody(setCreatedBy()) createWorkflowstateDto: Workflowstate,
  ) {
    return await this.workflowstateService._create(createWorkflowstateDto);
  }

  @Patch('/:id?')
  async patch(
    @Query() query,
    @Body() patchWorkflowstateDto: Partial<Workflowstate>,
    @Param('id') id,
  ) {
    return await this.workflowstateService._patch(
      id,
      patchWorkflowstateDto,
      query,
    );
  }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    //return await this.workflowstateService._remove(id, query, user);
    try {
      return await this.workflowstateService.deleteWorkflowState(id);
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }
}
