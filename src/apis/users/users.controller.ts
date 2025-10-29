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
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { UserRole } from './constants/users.role';
import { OrgRole, OrgRoleValues } from './constants/user.orgRole';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthService } from '../auth/auth.service';
import { normalisePhoneFormat } from 'src/utils/normalisePhoneNumber';
import { Users } from 'src/schemas/users.schema';
import { MailService } from 'src/utils/nodemailer';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async find(@Query() query: Record<string, any>) {
    return await this.usersService._find(query);
  }

  @Get('meta')
  async getUsersByOrgRole(@Request() req: any) {
    return await this.usersService.getRoleCounts(req.user.organisation);
  }

  @Get(':id?')
  async get(@Query() query: Record<string, any>, @Param('id') id: string) {
    return await this.usersService._get(id, query);
  }

  @Roles(UserRole.SKRIBE_SUPER_ADMIN)
  @Post()
  async create(@Body() createUsersDto: Users) {
    if (!createUsersDto.password) {
      throw new BadRequestException('Password is required');
    }

    createUsersDto.role = UserRole.SKRIBE_ADMIN;

    const saltOrRounds = 10;
    const password = await bcrypt.hash(createUsersDto.password, saltOrRounds);

    createUsersDto.phone = normalisePhoneFormat(createUsersDto.phone);

    const user = (await this.usersService._create({
      ...createUsersDto,
      password,
    })) as Users;

    const sanitizedUser = this.usersService.sanitizeUser(user);

    const mailer = new MailService();
    try {
      await mailer.sendMail(sanitizedUser.email, sanitizedUser.firstName);
      return {
        message: 'New admin created successfully! and mail sent sucessfully',
        user: sanitizedUser,
      };
    } catch (error) {
      return {
        message:
          'New admin created successfully! but welcome mail could not be sent',
        user: sanitizedUser,
      };
    }
  }

  @Patch(':id?')
  async patch(
    @Query() query,
    @Body() patchUsersDto: Partial<Users>,
    @Param('id') id,
  ) {
    return await this.usersService._patch(id, patchUsersDto, query);
  }

  @Delete(':id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.usersService._remove(id, query, user);
  }
}
