import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleUsersController } from './googleUsers.controller';
import { GoogleUsersService } from './googleUsers.service';
import { GoogleUsers, GoogleUsersSchema } from 'src/schemas/googleUsers.schema';
import { GoogleOAuthModule } from '../googleOAuth/googleOAuth.module';
import { UsersModule } from '../users/users.module';
import {
  GoogleTenant,
  GoogleTenantSchema,
} from 'src/schemas/googleTenant.schema';
import { GoogleTenantService } from './googleTenant.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GoogleUsers.name, schema: GoogleUsersSchema },
      { name: GoogleTenant.name, schema: GoogleTenantSchema },
    ]),
    forwardRef(() => GoogleOAuthModule),
    UsersModule,
  ],
  controllers: [GoogleUsersController],
  providers: [GoogleUsersService, GoogleTenantService],
  exports: [GoogleUsersService, GoogleTenantService],
})
export class GoogleUsersModule {}
