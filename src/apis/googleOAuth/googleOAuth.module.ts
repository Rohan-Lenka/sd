import { forwardRef, Module } from '@nestjs/common';
import { GoogleOAuthService } from './googleOAuth.service';
import { GoogleOAuthController } from './googleOAuth.controller';
import { GoogleUsersModule } from '../googleUsers/googleUsers.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => GoogleUsersModule), UsersModule, AuthModule],
  controllers: [GoogleOAuthController],
  providers: [GoogleOAuthService],
  exports: [GoogleOAuthService],
})
export class GoogleOAuthModule {}
