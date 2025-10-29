import { microsoftConfigFactory } from '../../config/microsoft.config';
import {
  getOAuthBaseURL,
  getOAuthTokeURL,
  getOPENID_ConfigURL,
} from './constants/microsoftBaseURL.OAuth';
import * as crypto from 'crypto';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { model, Model } from 'mongoose';
import {
  MicrosoftUsers,
  MicrosoftUsersSchema,
} from 'src/schemas/microsoftUsers.schema';
import {
  MicrosoftTenant,
  MicrosoftTenantSchema,
} from 'src/schemas/microsoftTenant.schema';
import { graph_apis } from './constants/Graph_apis';

export class MicrosoftOAuth {
  private OAuthClient: {
    client_id: string;
    tenant_id: string;
    client_secret: string;
    secret_id: string;
    redirect_uri: string;
  };
  private issuerURL: string;

  private MicrosoftUserModel: Model<MicrosoftUsers>;
  private MicrosoftTenantModel: Model<MicrosoftTenant>;

  constructor() {
    this.OAuthClient = microsoftConfigFactory();
    this.issuerURL = `https://login.microsoftonline.com/${this.OAuthClient.tenant_id}/v2.0`;
    this.MicrosoftUserModel = model<MicrosoftUsers>(
      MicrosoftUsers.name,
      MicrosoftUsersSchema,
    );
    this.MicrosoftTenantModel = model<MicrosoftTenant>(
      MicrosoftTenant.name,
      MicrosoftTenantSchema,
    );
  }

  getAuthUrl() {
    const baseURL = getOAuthBaseURL(this.OAuthClient.tenant_id);

    const params = {
      client_id: this.OAuthClient.client_id,
      response_type: 'code',
      redirect_uri: this.OAuthClient.redirect_uri,
      response_mode: 'query',
      scope: 'offline_access user.read mail.read',
      state: crypto.randomBytes(16).toString('hex'),
    };

    const queryString = new URLSearchParams(params).toString();
    return `${baseURL}?${queryString}`;
  }

  async handleCallback(code: string, state: string) {
    const tokenURL = getOAuthTokeURL(this.OAuthClient.tenant_id);

    const params = {
      client_id: this.OAuthClient.client_id,
      scope: 'openid profile email offline_access user.read mail.read',
      code: code,
      redirect_uri: this.OAuthClient.redirect_uri,
      grant_type: 'authorization_code',
      client_secret: this.OAuthClient.client_secret,
    };

    const queryParams = new URLSearchParams(params).toString();
    const res = await fetch(`${tokenURL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: queryParams,
    });
    const data = await res.json();

    if (!res.ok) {
      console.log('Token exhange failed:', data);
      throw new Error('Failed to fetch tokens');
    }

    try {
      //console.log("data from microsoft token endpoint" , data)
      const payload = await this.verifyIdToken(data.id_token);
      if (!payload) {
        throw new Error('Failed to retrieve payload from id_token');
      }

      return { payload, tokens: data };
    } catch (error) {
      console.log('Error in verifying ID token', error.message);
      throw new Error('Failed to verify ID token');
    }
  }

  async verifyIdToken(id_token: string) {
    const jose = await Function("return import('jose')")();
    const { jwtVerify } = jose;
    try {
      const JWKS = await this.getJWKS();
      const { payload } = await jwtVerify(id_token, JWKS, {
        audience: this.OAuthClient.client_id,
        issuer: this.issuerURL,
      });

      return payload;
    } catch (error) {
      console.log(error.message);
      throw new Error('Failed to verify ID token');
    }
  }

  private async getJWKS() {
    const jose = await Function("return import('jose')")();
    const { createRemoteJWKSet } = jose;
    try {
      const openID_ConfigURL = getOPENID_ConfigURL(this.OAuthClient.tenant_id);
      const res = await fetch(openID_ConfigURL);
      const data = await res.json();
      this.issuerURL = data.issuer;
      return createRemoteJWKSet(new URL(data.jwks_uri));
    } catch (error) {
      console.log('Error in fetching JWKS URI ', error.message);
      throw new Error('Failed to fetch JWKS URI');
    }
  }

  async registerUser(
    refresh_token: string,
    access_token: string,
    payload: Record<string, any>,
  ) {
    try {
      const does_msUser_exist = await this.MicrosoftUserModel.findOne({
        microsoftId: payload.oid,
      });

      if (does_msUser_exist) {
        console.log('User already exists');
        return { user: does_msUser_exist };
      }

      const res = await fetch(graph_apis.get_user_profile, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(
          'Failed to fetch user profile from Microsoft Graph API',
        );
      }

      const data = await res.json();

      const new_msUser = new this.MicrosoftUserModel({
        microsoftId: data.id,
        businessPhones: data.businessPhones,
        displayName: data.displayName,
        givenName: data.givenName,
        jobTitle: data.jobTitle,
        mail: data.mail,
        mobilePhone: data.mobilePhone,
        officeLocation: data.officeLocation,
        preferredLanguage: data.preferredLanguage,
        surname: data.surname,
        userPrincipalName: data.userPrincipalName,
        refresh_token: refresh_token,
      });

      await new_msUser.save();

      console.log('New Microsoft User registered in the app successfully');
      return { user: new_msUser };
    } catch (error) {
      console.log('Error in registering microsoft user ', error.message);
      throw new Error('Failed to register microsoft user');
    }
  }

  async registerTenant(access_token: string, payload: Record<string, any>) {
    try {
      const tenantDoesExist = await this.MicrosoftTenantModel.findOne({
        id: payload.tid,
      });

      if (tenantDoesExist) {
        console.log('tenant already exist');
        return { tenant: tenantDoesExist };
      }

      const res = await fetch(graph_apis.get_tenant_info, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(
          'Failed to fetch tenant profile from Microsoft Graph API',
        );
      }

      const data = await res.json();

      const new_tenant = new this.MicrosoftTenantModel(data.value[0]);

      await new_tenant.save();

      console.log('New Microsoft Tenant registered in the app successfully');
      return { tenant: new_tenant };
    } catch (error) {
      console.log('Error in registering microsoft tenant ', error.message);
      throw new Error('Failed to register microsoft tenant');
    }
  }
}
