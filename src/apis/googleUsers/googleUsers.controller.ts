import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GoogleUsersService } from './googleUsers.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { GoogleUsers } from 'src/schemas/googleUsers.schema';
import { Public } from '../auth/decorators/public.decorator';
import { GoogleTenantService } from './googleTenant.service';

@Controller('google')
export class GoogleUsersController {
  constructor(
    private readonly googleUsersService: GoogleUsersService,
    private readonly googleTenantService: GoogleTenantService,
  ) {}

  @Get('user')
  async find(@Query() query: Record<string, any>) {
    return await this.googleUsersService._find(query);
  }

  @Get('user/:id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.googleUsersService._get(id, query);
  }

  @Patch(':tenantId/user/:googleUserId')
  async patchUserSchema(
    @Param('googleUserId') id: string,
    @Param('tenantId') tenantId: string,
    @Body() body: any,
  ) {
    try {
      const googleUser = (await this.googleUsersService._get(id, {
        $select: 'primaryEmail',
      })) as GoogleUsers;

      const res = await this.googleUsersService.updateUserInGoogle(
        googleUser.primaryEmail,
        body,
        tenantId,
      );

      return res;
    } catch (err) {
      throw err;
    }
  }

  @Get('tenant')
  async findTenants(@Query() query: Record<string, any>) {
    return await this.googleTenantService._find(query);
  }

  @Get('tenant/:id?')
  async getTenant(
    @Query() query: Record<string, any>,
    @Param('id') id: string,
  ) {
    return await this.googleTenantService._get(id, query);
  }

  @Public()
  @Post('sync/:tenantId')
  async syncUsers(@Param('tenantId') tenantId: string) {
    try {
      await this.googleUsersService.fetchAndSaveAllUsers(tenantId);
      return {
        success: 'true',
        message: 'Users have successfully been synced',
      };
    } catch (err) {
      return err;
    }
  }

  @Get('schema/:tenantId')
  async getSchema(@Param('tenantId') tenantId: string) {
    try {
      if (!tenantId) return new BadRequestException('Tenant ID required');
      const list = await this.googleTenantService.getCustomSchemas(tenantId);
      return list;
    } catch (err) {
      return err;
    }
  }

  @Post('schema/:tenantId')
  async createSchema(@Param('tenantId') tenantId: string, @Body() body: any) {
    try {
      if (!tenantId) return new BadRequestException('Tenant ID required');
      return this.googleTenantService.createSchema(tenantId, body);
    } catch (err) {
      return err;
    }
  }

  @Patch('schema/:tenantId')
  async patchSchema(
    @Param('tenantId') tenantId: string,
    @Query('schemaKey') schemaKey: string,
    @Body() body: any,
  ) {
    try {
      if (!tenantId) return new BadRequestException('Tenant ID required');
      return this.googleTenantService.updateSchema(tenantId, schemaKey, body);
    } catch (err) {
      return err;
    }
  }

  @Patch('/:id?')
  async patch(
    @Query() query,
    @Body() patchGoogleUsersDto: Partial<GoogleUsers>,
    @Param('id') id,
  ) {
    return await this.googleUsersService._patch(id, patchGoogleUsersDto, query);
  }

  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.googleUsersService._remove(id, query, user);
  }
}
