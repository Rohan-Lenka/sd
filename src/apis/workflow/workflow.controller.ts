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
  UseGuards,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { Workflow } from 'src/schemas/workflow.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';
import { OrgRolesGuard } from '../auth/guards/orgRole.guard';

// import { OrgRoles } from '../auth/decorators/orgRole.decorator';
// import { OrgRole } from '../users/constants/user.orgRole';
import { ModifyQuery } from '@nest-extended/core/common/decorators/ModifyQuery.decorator';
import {
  SetOrganisation,
  SetOrganisationQuery,
} from '../../decorators/SetOrganisation';
//import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '../users/constants/users.role';

//@UseGuards(OrgRolesGuard)
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  //@Roles(UserRole.SKRIBE_SUPER_ADMIN)
  // @OrgRoles(OrgRole.ADMIN)
  @Get()
  async find(@ModifyQuery(SetOrganisationQuery()) query: Record<string, any>) {
    return await this.workflowService._find(query);
  }

  //@Roles(UserRole.SKRIBE_SUPER_ADMIN)
  // @OrgRoles(OrgRole.ADMIN)
  @Get('/:id?')
  async get(
    @ModifyQuery(SetOrganisationQuery()) query: Record<string, any>,
    @Param('id') id: string,
  ) {
    return await this.workflowService._get(id, query);
  }

  //@Roles(UserRole.SKRIBE_SUPER_ADMIN)
  // @OrgRoles(OrgRole.ADMIN)
  @Post()
  async create(
    @ModifyBody([setCreatedBy(), SetOrganisation()])
    createWorkflowDto: Workflow,
  ) {
    try {
      return await this.workflowService._create(createWorkflowDto);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  //@Roles(UserRole.SKRIBE_SUPER_ADMIN)
  // @OrgRoles(OrgRole.ADMIN)
  @Patch('/:id?')
  async patch(
    @ModifyQuery(SetOrganisationQuery()) query,
    @Body() patchWorkflowDto: Partial<Workflow>,
    @Param('id') id,
  ) {
    return await this.workflowService._patch(id, patchWorkflowDto, query);
  }

  //@Roles(UserRole.SKRIBE_SUPER_ADMIN)
  // @OrgRoles(OrgRole.ADMIN)
  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    try {
      return await this.workflowService.deleteWorfklowTemplate(id);
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }
}
