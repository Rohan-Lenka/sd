import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { UsersService } from '../users/users.service';
@Controller('authentication')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post()
  signIn(@Body() signInDto: Record<string, any>) {
    if (signInDto.strategy === 'local') {
      return this.authService.signInLocal(signInDto.email, signInDto.password);
    }

    if (signInDto.strategy === 'phone') {
      return this.authService.signInPhone(signInDto.phone, signInDto.otp);
    }

    throw new BadRequestException('Invalid Strategy');
  }

  @Get('verify')
  getProfile(@Request() req: any) {
    return this.usersService.getUserWithOrg(req.user);
  }
}
