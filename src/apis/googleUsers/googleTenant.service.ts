import { NestService } from '@nest-extended/core/lib/nest.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GoogleTenant,
  GoogleTenantDocument,
} from 'src/schemas/googleTenant.schema';
import { GoogleOAuthService } from '../googleOAuth/googleOAuth.service';
import { admin_directory_v1 } from '@googleapis/admin';

@Injectable()
export class GoogleTenantService extends NestService<
  GoogleTenant,
  GoogleTenantDocument
> {
  constructor(
    @InjectModel(GoogleTenant.name)
    private readonly googleTenantModel: Model<GoogleTenant>,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {
    super(googleTenantModel);
  }

  async getCustomSchemas(tenantId: string) {
    try {
      const tenant = (await this.googleTenantModel.findById(
        tenantId,
      )) as GoogleTenant;

      if (!tenant?.refreshToken) {
        throw new Error(
          `No refresh token found for tenant ${tenantId}. Superadmin must log in first.`,
        );
      }

      const oauthClient = this.googleOAuthService.client;
      oauthClient.setCredentials({ refresh_token: tenant.refreshToken });
      const directory = new admin_directory_v1.Admin({
        auth: oauthClient,
      });

      const res = await directory.schemas.list({
        customerId: 'my_customer',
      });

      return res.data.schemas || [];
    } catch (err) {
      throw err;
    }
  }

  async createSchema(tenantId: string, schemaBody: any) {
    const tenant = await this.googleTenantModel.findById(tenantId);
    if (!tenant?.refreshToken) throw new Error('Tenant refresh token missing');

    const oauthClient = this.googleOAuthService.client;
    oauthClient.setCredentials({ refresh_token: tenant.refreshToken });

    const directory = new admin_directory_v1.Admin({ auth: oauthClient });
    const res = await directory.schemas.insert({
      customerId: 'my_customer',
      requestBody: schemaBody,
    });

    return this.syncSchema(tenantId);
  }

  async updateSchema(tenantId: string, schemaKey: string, schemaBody: any) {
    const tenant = await this.googleTenantModel.findById(tenantId);
    if (!tenant?.refreshToken) throw new Error('Tenant refresh token missing');

    const oauthClient = this.googleOAuthService.client;
    oauthClient.setCredentials({ refresh_token: tenant.refreshToken });

    const directory = new admin_directory_v1.Admin({ auth: oauthClient });
    const res = await directory.schemas.update({
      customerId: 'my_customer',
      schemaKey,
      requestBody: schemaBody,
    });

    return this.syncSchema(tenantId);
  }

  async deleteSchema(tenantId: string, schemaKey: string) {
    const tenant = await this.googleTenantModel.findById(tenantId);
    if (!tenant?.refreshToken) throw new Error('Tenant refresh token missing');

    const oauthClient = this.googleOAuthService.client;
    oauthClient.setCredentials({ refresh_token: tenant.refreshToken });

    const directory = new admin_directory_v1.Admin({ auth: oauthClient });
    await directory.schemas.delete({
      customerId: 'my_customer',
      schemaKey,
    });

    return this.syncSchema(tenantId);
  }

  async syncSchema(tenantId: string) {
    const schemas = await this.getCustomSchemas(tenantId);
    const res = await this.googleTenantModel.findByIdAndUpdate(
      tenantId,
      {
        customSchemas: schemas,
      },
      { new: true, upsert: true },
    );

    return res;
  }
}
