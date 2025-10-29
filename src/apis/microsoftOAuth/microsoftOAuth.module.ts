import { Module } from '@nestjs/common';
import { MicrosoftOAuthController } from './microsoftOAuth.controller';

@Module({
  controllers: [MicrosoftOAuthController],
})
export class MicrosoftOAuthModule {}
