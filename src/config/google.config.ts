import { registerAs } from '@nestjs/config';
import * as path from 'path';
import { promises as fs } from 'fs';
import { InternalServerErrorException } from '@nestjs/common';

export default registerAs('google', async () => {
  try {
    const credentialsPath = path.join(
      process.cwd(),
      'secrets',
      'google',
      process.env.GOOGLE_OAUTH_SECRET_FILE,
    );

    const fileContents = await fs.readFile(credentialsPath, 'utf-8');
    const { web } = JSON.parse(fileContents);

    if (!web?.client_id || !web?.client_secret || !web?.redirect_uris?.length) {
      throw new Error('Invalid Google OAuth JSON structure');
    }

    return {
      clientId: web.client_id,
      clientSecret: web.client_secret,
      redirectURI: {
        login: `https://dev.skribe.app/auth/google/callback`,
        chat: '', //to be added
      },
      loginScopes: [
        // // 'https://www.googleapis.com/auth/chat.bot',
        // 'https://www.googleapis.com/auth/chat.spaces',
        // 'https://www.googleapis.com/auth/chat.messages',
        'openid',
        'email',
        'profile',
      ],
      tenantScopes: [
        'https://www.googleapis.com/auth/admin.directory.user',
        'https://www.googleapis.com/auth/admin.directory.group',
        'https://www.googleapis.com/auth/admin.directory.domain',
        'https://www.googleapis.com/auth/admin.directory.customer',
        'https://www.googleapis.com/auth/admin.directory.userschema',
        // 'https://www.googleapis.com/auth/chat.bot',
        // 'https://www.googleapis.com/auth/chat.spaces',
        // 'https://www.googleapis.com/auth/chat.messages',
        'openid',
        'email',
        'profile',
      ],
      chatScopes: [
        'https://www.googleapis.com/auth/chat.bot',
        'https://www.googleapis.com/auth/chat.spaces',
        'https://www.googleapis.com/auth/chat.messages',
      ],
    };
  } catch (error) {
    console.error('[GoogleConfig] Failed to load credentials:', error.message);
    throw new InternalServerErrorException();
  }
});
