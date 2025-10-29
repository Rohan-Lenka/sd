import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { AudienceManagerService } from './audienceManager.service';
import { AudienceManager } from 'src/schemas/audienceManager.schema';
import {
  SetOrganisation,
  SetOrganisationQuery,
} from '../../decorators/SetOrganisation';
import { ModifyBody } from '@nest-extended/core/common/decorators/ModifyBody.decorator';
import { ModifyQuery } from '@nest-extended/core/common/decorators/ModifyQuery.decorator';

@Controller('audience-manager')
export class AudienceManagerController {
  constructor(
    private readonly audienceManagerService: AudienceManagerService,
  ) {}

  @Get()
  async getAudienceGroups(
    @ModifyQuery(SetOrganisationQuery()) query: Record<string, any>,
  ) {
    console.log(query);
    return await this.audienceManagerService._find(query);
  }

  @Post()
  async createAudienceGroup(
    @ModifyBody(SetOrganisation()) payload: AudienceManager,
  ) {
    try {
      return await this.audienceManagerService.createAudienceGroup(payload);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/filter-users')
  async filterUsersInAudienceGroup(
    @ModifyBody(SetOrganisation()) payload: Record<string, any>,
  ) {
    try {
      return await this.audienceManagerService.getUsersFromFilters(
        payload.filters,
        payload.organisation,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/:id')
  async getUsersFromAudienceGroup(@Param('id') groupId: string) {
    try {
      return await this.audienceManagerService.getUserfromAudienceGroup(
        groupId,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/:id')
  async deleteAudienceGroup(@Param('id') groupId: string) {
    try {
      return await this.audienceManagerService.deleteAudienceGroup(groupId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/:id')
  async updateGroup(
    @Param('id') groupId: string,
    @ModifyBody(SetOrganisation()) updatePayload: AudienceManager,
  ) {
    console.log(updatePayload);
    try {
      return await this.audienceManagerService.updateGroup(
        groupId,
        updatePayload,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
