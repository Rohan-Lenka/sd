import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { admin_directory_v1 } from '@googleapis/admin';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import {
  GoogleUsers,
  GoogleUsersDocument,
} from 'src/schemas/googleUsers.schema';
import { GoogleOAuthService } from '../googleOAuth/googleOAuth.service';
import { GoogleTenant } from 'src/schemas/googleTenant.schema';
import { UsersService } from '../users/users.service';
import { UserProvider } from '../users/constants/user.provider';
import { GoogleTenantService } from './googleTenant.service';

@Injectable()
export class GoogleUsersService extends NestService<
  GoogleUsers,
  GoogleUsersDocument
> {
  constructor(
    @InjectModel(GoogleUsers.name)
    private readonly googleUsersModel: Model<GoogleUsers>,
    @InjectModel(GoogleTenant.name)
    private readonly googleTenantModel: Model<GoogleTenant>,
    @Inject(forwardRef(() => GoogleOAuthService))
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly usersService: UsersService,
  ) {
    super(googleUsersModel);
  }

  async saveOrUpdateUser(user: any, sub?: string) {
    const userPayload: Partial<GoogleUsers> = {
      directoryId: user.id,
      etag: user.etag,
      primaryEmail: user.primaryEmail,
      recoveryEmail: user.recoveryEmail,
      recoveryPhone: user.recoveryPhone,
      name: {
        givenName: user.name?.givenName,
        familyName: user.name?.familyName,
        fullName: user.name?.fullName,
      },
      isAdmin: user.isAdmin ?? false,
      isDelegatedAdmin: user.isDelegatedAdmin ?? false,
      lastLoginTime: user.lastLoginTime ? new Date(user.lastLoginTime) : null,
      creationTime: user.creationTime ? new Date(user.creationTime) : null,
      agreedToTerms: user.agreedToTerms ?? false,
      suspended: user.suspended ?? false,
      archived: user.archived ?? false,
      changePasswordAtNextLogin: user.changePasswordAtNextLogin ?? false,
      ipWhitelisted: user.ipWhitelisted ?? false,
      emails: user.emails ?? [],
      languages: user.languages ?? [],
      aliases: user.aliases ?? [],
      nonEditableAliases: user.nonEditableAliases ?? [],
      customerId: user.customerId,
      orgUnitPath: user.orgUnitPath ?? '',
      isMailboxSetup: user.isMailboxSetup ?? false,
      isEnrolledIn2Sv: user.isEnrolledIn2Sv ?? false,
      isEnforcedIn2Sv: user.isEnforcedIn2Sv ?? false,
      includeInGlobalAddressList: user.includeInGlobalAddressList ?? false,
      thumbnailPhotoUrl: user.thumbnailPhotoUrl ?? '',
      thumbnailPhotoEtag: user.thumbnailPhotoEtag ?? '',
      refreshToken: user.refreshToken ?? null,
      customSchemas: user.customSchemas ?? {},
    };

    if (sub) {
      userPayload.sub = sub;
    }

    try {
      const savedUser = await this.googleUsersModel.findOneAndUpdate(
        { directoryId: userPayload.directoryId },
        { $set: userPayload },
        { new: true, upsert: true },
      );
      return savedUser;
    } catch (dbError: any) {
      console.error(
        '[GoogleUsersService.saveOrUpdateUser]: Upsert failed:',
        dbError,
      );
      throw new Error(
        `Failed to upsert user in database: ${dbError.message || dbError}`,
      );
    }
  }

  async fetchAndSaveAllUsers(tenantId: string) {
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

    const admin = new admin_directory_v1.Admin({ auth: oauthClient });

    let pageToken: string | undefined = undefined;

    try {
      do {
        const res = await admin.users.list({
          customer: 'my_customer',
          maxResults: 10,
          pageToken,
          orderBy: 'email',
          projection: 'full',
        });

        const users = res.data.users ?? [];

        for (const user of users) {
          try {
            const googleUser = (await this.saveOrUpdateUser(user)) as any;
            if (googleUser?._id) {
              await this.usersService.upsertUser({
                firstName: googleUser.name.givenName,
                lastName: googleUser.name.familyName,
                phone: googleUser.recoveryPhone,
                email: googleUser.emails[0].address,
                provider: UserProvider.GOOGLE,
                googleUserMetadata: googleUser._id,
                googleTenant: tenant._id,
              });
            }
          } catch (err) {
            console.error(
              `[fetchAndSaveAllUsers] Failed to save user ${user.primaryEmail}`,
              err,
            );
          }
        }

        pageToken = res.data.nextPageToken ?? undefined;
      } while (pageToken);
    } catch (apiError: any) {
      console.error(
        '[fetchAndSaveAllUsers] Google Admin API call failed:',
        apiError,
      );

      if (apiError.code === 403 || apiError?.response?.status === 403) {
        throw new Error(
          'Access denied: Superadmin must log in to grant admin privileges. Please log in again.',
        );
      }

      throw new Error(
        `Failed to fetch users from Google Admin API: ${apiError.message || apiError}`,
      );
    }
  }

  async saveOrUpdateTenant(tokens: Record<string, any>) {
    let customerData: Record<string, any>;

    try {
      const oauthClient = this.googleOAuthService.client;
      oauthClient.setCredentials({ refresh_token: tokens.refresh_token });

      const admin = new admin_directory_v1.Admin({
        auth: oauthClient,
      });

      const response = await admin.customers.get({
        customerKey: 'my_customer',
      });

      const schemaResponse = await admin.schemas.list({
        customerId: 'my_customer',
      });

      customerData = response.data;
      customerData.customSchemas = schemaResponse.data.schemas;
    } catch (apiError: any) {
      console.error(
        '[GoogleTenantService.saveOrUpdateTenant]: Google Admin API call failed:',
        apiError,
      );
      if (apiError.code === 403 || apiError?.response?.status === 403) {
        throw new Error(
          'Access denied: Only Super Admin can grant these privileges.',
        );
      }

      throw new Error(
        `Failed to fetch customer data from Google Admin API: ${apiError.message || apiError}`,
      );
    }

    const tenantPayload = {
      customerId: customerData.id!,
      customerDomain: customerData.customerDomain!,
      etag: customerData.etag ?? null,
      refreshToken: tokens?.refresh_token,
      scopes: tokens?.scope ? tokens.scope.split(' ') : [],
      lastAuthDate: new Date(),
      customerCreationTime: customerData.customerCreationTime
        ? new Date(customerData.customerCreationTime)
        : null,
      language: customerData.language,
      postalAddress: customerData.postalAddress
        ? {
            contactName: customerData.postalAddress.contactName,
            organizationName: customerData.postalAddress.organizationName,
            addressLine1: customerData.postalAddress.addressLine1,
            addressLine2: customerData.postalAddress.addressLine2,
            addressLine3: customerData.postalAddress.addressLine3,
            locality: customerData.postalAddress.locality,
            region: customerData.postalAddress.region,
            postalCode: customerData.postalAddress.postalCode,
            countryCode: customerData.postalAddress.countryCode,
          }
        : {},
      phoneNumber: customerData.phoneNumber ?? null,
      alternateEmail: customerData.alternateEmail ?? null,
      customSchemas: customerData.customSchemas ?? {},
    };

    try {
      const tenant = await this.googleTenantModel.findOneAndUpdate(
        { customerId: tenantPayload.customerId },
        { $set: tenantPayload },
        { new: true, upsert: true },
      );

      return tenant;
    } catch (dbError: any) {
      console.error(
        '[GoogleTenantService.saveOrUpdateTenant]: Upsert failed: ',
        dbError,
      );
      throw new Error(
        `Failed to upsert tenant in database: ${dbError.message || dbError}`,
      );
    }
  }

  async updateUserInGoogle(userKey: string, body: any, tenantId: string) {
    const tenant = await this.googleTenantModel.findById(tenantId);

    if (!tenant?.refreshToken) throw new Error('Tenant refresh token missing');
    const oauthClient = this.googleOAuthService.client;

    oauthClient.setCredentials({ refresh_token: tenant.refreshToken });

    const admin = new admin_directory_v1.Admin({
      auth: oauthClient,
    });

    const res = await admin.users.update({
      userKey,
      requestBody: body,
    });

    const savedUser = await this.googleUsersModel.findOneAndUpdate(
      { primaryEmail: userKey },
      {
        $set: {
          customSchemas: res.data.customSchemas,
        },
      },
      { new: true, upsert: true },
    );

    return savedUser;
  }
}
