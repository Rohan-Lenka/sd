import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Users } from 'src/schemas/users.schema';
import { jwtConstants } from './constants/jwt-constants';
import {
  DEV_OTPS,
  DEV_PASSWORDS,
  isEasterEggEnabled,
} from 'src/constants/easterEggs';
import { normalisePhoneFormat } from 'src/utils/normalisePhoneNumber';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signInGoogle(email: string) {
    // use sub to find if user exists, patch new details
    // if not create a new user
    // return token
  }

  async signInLocal(email: string, pass: string): Promise<any> {
    if (!email) {
      throw new BadRequestException('Email required');
    }

    if (!pass) {
      throw new BadRequestException('Password required');
    }

    const [user] = (await this.usersService._find({
      $paginate: false,
      email,
      $limit: 1,
      $populate: ['organisation'],
      $select: [
        'firstName',
        'middleName',
        'lastName',
        'phone',
        'email',
        'password',
        'role',
        'provider',
      ],
    })) as Users[];

    if (!user) throw new UnauthorizedException("User doesn't exist");

    // if (user.provider)
    //   throw new BadRequestException(
    //     `Cannot use email, please use ${user.provider.toLowerCase()} login.`,
    //   );

    const easterEggValid = isEasterEggEnabled() && DEV_PASSWORDS.includes(pass);

    const passwordValid = await bcrypt.compare(pass, user.password);
    if (!easterEggValid && !passwordValid) {
      throw new UnauthorizedException('invalid password');
    }

    return this.generateAuthToken(user);
  }

  async signInPhone(phone: string, otp: string): Promise<any> {
    if (!phone) {
      throw new BadRequestException('Phone required');
    }

    if (!otp) {
      throw new BadRequestException('OTP required');
    }

    phone = normalisePhoneFormat(phone);

    const [user] = (await this.usersService._find({
      $paginate: false,
      phone,
      $limit: 1,
      $populate: ['organisation'],
      $select: [
        'firstName',
        'middleName',
        'lastName',
        'phone',
        'email',
        'provider',
        'role',
      ],
    })) as Users[];

    if (!user) throw new UnauthorizedException("User doesn't exist");

    if (user.provider)
      throw new BadRequestException(
        `Cannot use phone, please use ${user.provider.toLowerCase()} login.`,
      );

    const easterEggValid = isEasterEggEnabled() && DEV_OTPS.includes(otp);

    if (!easterEggValid) {
      throw new UnauthorizedException('invalid OTP');
    }

    return this.generateAuthToken(user);
  }

  async generateAuthToken(user: any) {
    const sanitizedUser = this.usersService.sanitizeUser(user);

    const payload = {
      sub: { id: user._id },
      user: sanitizedUser,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
    });

    return {
      access_token,
      user: sanitizedUser,
    };
  }
}
