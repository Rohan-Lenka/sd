// src/google-chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Useremail_dmspace } from 'src/schemas/useremail_dmspace.schema';
import { deleteModel, Model } from 'mongoose';

@Injectable()
export class GooglechatService {
  private readonly serviceAccountPath: string;
  private readonly scopes: string[];

  constructor(
    @InjectModel(Useremail_dmspace.name)
    private readonly userEmailDMSpaceModel: Model<Useremail_dmspace>,
  ) {
    this.serviceAccountPath = path.join(
      process.cwd(),
      'secrets',
      'service_account',
      'skribe-dev-app-6eb4b67e7ddd.json',
    );
    this.scopes = ['https://www.googleapis.com/auth/chat.bot'];
  }

  private async getAccessToken() {
    const auth = new GoogleAuth({
      keyFile: this.serviceAccountPath,
      scopes: this.scopes,
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token;
  }

  async sendMessageToSpace(spaceName: string, message: string) {
    const token = await this.getAccessToken();
    const url = `https://chat.googleapis.com/v1/${spaceName}/messages`;

    const body = { text: message };

    const res = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  }

  async sendMessageToUser(dmspaceID: string, message: string) {
    const token = await this.getAccessToken();

    const url = `https://chat.googleapis.com/v1/${dmspaceID}/messages`;

    const body = { text: message };

    const res = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  }

  async store_dmSpaceId(email: string, spaceType: string, dmSpaceID: string) {
    await this.userEmailDMSpaceModel.create({
      email,
      spaceType,
      dmSpaceID: dmSpaceID,
    });

    return { message: 'ok' };
  }

  async findDMSpaceID_ByEmail(email: string) {
    const doc = await this.userEmailDMSpaceModel.findOne({
      email: email,
      spaceType: 'DIRECT_MESSAGE',
    });

    // console.log(doc);

    return doc?.dmSpaceID;
  }
}
