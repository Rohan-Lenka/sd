import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { admin_directory_v1 } from '@googleapis/admin';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { GoogleUsersService } from '../googleUsers/googleUsers.service';
import { UsersService } from '../users/users.service';
import { Users } from 'src/schemas/users.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GoogleOAuthService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => GoogleUsersService))
    private readonly googleUsersService: GoogleUsersService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  public client: OAuth2Client;

  private googleConfig: {
    clientId: string;
    clientSecret: string;
    redirectURI: {
      login: string;
      chat: string;
    };
    loginScopes: string[];
    tenantScopes: string[];
    chatScopes: string[];
  };

  async onModuleInit() {
    this.googleConfig = await this.configService.get('google');
    this.client = new OAuth2Client(
      this.googleConfig.clientId,
      this.googleConfig.clientSecret,
      //this.googleConfig.redirectURI,
    );
  }

  getAuthUrl(isTenant: boolean = false) {
    const scopes = isTenant
      ? this.googleConfig.tenantScopes
      : this.googleConfig.loginScopes;

    const state = JSON.stringify({ tenant: isTenant });

    return this.client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes.join(' '),
      state,
      redirect_uri: this.googleConfig.redirectURI.login,
    });
  }

  getChatAuthUrl() {
    const scopes = this.googleConfig.chatScopes;
    const state = JSON.stringify({ chat: true });

    return this.client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes.join(' '),
      state,
      redirect_uri: this.googleConfig.redirectURI.chat,
    });
  }

  async handleCallback(code: string, tenant: boolean, isChat: boolean = false) {
    const redirectUri = isChat
      ? this.googleConfig.redirectURI.chat
      : this.googleConfig.redirectURI.login;
    try {
      const tokens = await this.exchangeCodeForTokens(code, redirectUri);
      const payload = await this.verifyIdToken(tokens.id_token!);

      this.client.setCredentials(tokens);

      if (isChat) {
        // handle chat-specific channel creation here
        return { message: 'Chat connection successful', tokens };
      }

      if (tenant) {
        const tenantDoc = await this.saveTenant(tokens);

        await this.createSuperAdminUser(tokens, payload.email, payload.sub);

        return {
          message: 'Tenant consent saved',
          tenant: tenantDoc,
          adminInfo: payload,
        };
      } else {
        const [user] = (await this.usersService._find({
          email: payload.email,
          $paginate: false,
          $populate: ['organisation'],
        })) as Users[];

        if (!user) {
          throw new Error(
            `No user found for email ${payload.email}. Please contact admin.`,
          );
        }

        return this.authService.generateAuthToken(user);
      }
    } catch (err) {
      console.error('[GoogleOAuthService.handleCallback] Error', err);
      throw err;
    }
  }

  private async exchangeCodeForTokens(code: string, redirectUri: string) {
    try {
      const { tokens } = await this.client.getToken({
        code,
        redirect_uri: redirectUri,
      });
      if (!tokens) throw new Error('No tokens returned from Google.');
      return tokens;
    } catch (err) {
      console.error('[exchangeCodeForTokens] Failed', err);
      throw new InternalServerErrorException(
        'Failed to exchange code for tokens.',
      );
    }
  }

  private async verifyIdToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.googleConfig.clientId,
      });
      const payload = ticket.getPayload();
      if (!payload)
        throw new Error('ID token verification failed, empty payload.');
      return payload;
    } catch (err) {
      console.error('[verifyIdToken] Failed', err);
      throw new UnauthorizedException('Invalid Google ID token.');
    }
  }

  private async saveTenant(tokens: Record<string, any>) {
    try {
      const tenantDoc =
        await this.googleUsersService.saveOrUpdateTenant(tokens);
      return tenantDoc;
    } catch (err) {
      console.error('[saveTenant] Failed', err);
      throw err;
    }
  }

  private async createSuperAdminUser(
    tokens: any,
    superAdminEmail: string,
    sub: string,
  ) {
    try {
      this.client.setCredentials({ refresh_token: tokens.refresh_token });

      const admin = new admin_directory_v1.Admin({
        auth: this.client,
      });

      const { data: user } = await admin.users.get({
        userKey: superAdminEmail,
      });

      if (user) {
        await this.googleUsersService.saveOrUpdateUser(user, sub);
      }
    } catch (err) {
      console.error('[createSuperAdminUser] Failed', err);
      throw new InternalServerErrorException(
        'Failed to fetch or save super admin user.',
      );
    }
  }
}
