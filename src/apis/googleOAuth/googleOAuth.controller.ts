import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { GoogleOAuthService } from './googleOAuth.service';

@Controller('auth/google')
export class GoogleOAuthController {
  constructor(private readonly googleOAuthService: GoogleOAuthService) {}

  @Public()
  @Get('tenant')
  tenantConsent() {
    return { url: this.googleOAuthService.getAuthUrl(true) };
  }
  catch() {
    return { url: '/error?reason=tenant_login_failed' };
  }

  @Public()
  @Get('login')
  userLogin() {
    try {
      return { url: this.googleOAuthService.getAuthUrl() };
    } catch (error) {
      return { url: '/error?reason=user_login_failed' };
    }
  }

  @Public()
  @Get('chat/connect')
  connectGoogleChat() {
    try {
      return { url: this.googleOAuthService.getChatAuthUrl() };
    } catch (error) {
      return { url: '/error?reason=chat_connect_failed' };
    }
  }

  @Public()
  @Get('chat/callback')
  async handleChatCallback(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    try {
      const result = await this.googleOAuthService.handleCallback(
        code,
        false,
        true,
      );
      return { message: 'Chat connected successfully', ...result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    try {
      const { tenant } = JSON.parse(state as string);
      const result = await this.googleOAuthService.handleCallback(
        code,
        tenant,
        false,
      );
      return { message: 'Login successful', ...result };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
