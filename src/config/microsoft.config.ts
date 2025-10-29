import { registerAs } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { InternalServerErrorException } from '@nestjs/common';

export default registerAs('microsoft', () => {
  try {
    const credentialsPath = path.join(
      process.cwd(),
      'secrets',
      'microsoft',
      'ms_secret.json',
    );
    const raw = fs.readFileSync(credentialsPath, 'utf-8');
    const credentials = JSON.parse(raw);
    return {
      client_id: credentials.client_id,
      tenant_id: credentials.tenant_id,
      client_secret: credentials.client_secret,
      secret_id: credentials.secret_id,
      redirect_uri: `${process.env.HOST}/auth/microsoft/callback`,
    };
  } catch (error) {
    console.log('[Microsoft] Failed to load credentials:', error.message);
    throw new InternalServerErrorException();
  }
});

//caching the config to avoid multiple JSON reads
let cachedConfig: any = null;

export const microsoftConfigFactory = () => {
  if (!cachedConfig) {
    const configFactory = require('./microsoft.config').default;
    cachedConfig = configFactory();
  }
  return cachedConfig;
};
