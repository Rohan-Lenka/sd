import {
  Controller,
  Get,
  Query,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';
import { MicrosoftOAuth } from './microsoftOAuth.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('auth/microsoft')
export class MicrosoftOAuthController {
  private microsoftOAuth: MicrosoftOAuth;
  constructor() {
    this.microsoftOAuth = new MicrosoftOAuth();
  }

  @Public()
  @Get('login')
  //@Redirect()
  userLogin() {
    return { url: this.microsoftOAuth.getAuthUrl() };
  }

  // @Public()
  // @Get('callback')
  // async function(
  //   @Query('code') code: string,
  //   @Query('state') state: string,
  // ){
  //   return {
  //     code : code,
  //     status : state
  //   }
  // }

  @Public()
  @Get('exchange')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    try {
      const { payload, tokens } = await this.microsoftOAuth.handleCallback(
        code,
        state,
      );

      const { user } = await this.microsoftOAuth.registerUser(
        tokens.refresh_token,
        tokens.access_token,
        payload,
      );

      const { tenant } = await this.microsoftOAuth.registerTenant(
        tokens.access_token,
        payload,
      );

      //this line may change according to frontend requirement
      return { message: 'Login successfull', payload, tokens, user, tenant };
    } catch (error) {
      console.log(
        'Error in micrsoft callback. failed to fetch Tokens',
        error.message,
      );
      throw new UnauthorizedException(
        'Failed to hanlde Callback and retrieve tokens',
      );
    }
  }
}
