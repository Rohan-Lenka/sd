import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { GooglechatService } from './googlechat.service';
import { Public } from '../auth/decorators/public.decorator';
import { Response } from 'express';
import { samplerequest, welcomeCardV1 } from './constants/welcome';

@Public()
@Controller('googleChat')
export class GooglechatController {
  constructor(private readonly googlechatService: GooglechatService) {}

  //webhook call when user is added to space
  @Public()
  @Post('space')
  async handleAddedToSpace(@Body() body: any) {
    //console.log("SystemID token: " , body.authorizationEventObject.systemIdToken)
    console.log(
      body.chat.addedToSpacePayload.space.name,
      ' ',
      body.chat.addedToSpacePayload.space.spaceType,
      ' ',
      body.chat.user.email,
    );
    const email = body.chat.user.email;
    const spaceType = body.chat.addedToSpacePayload.space.spaceType;
    const spaceID = body.chat.addedToSpacePayload.space.name;

    await this.googlechatService.store_dmSpaceId(email, spaceType, spaceID);

    // TODO: store space info in DB for sending messages later
    return { status: 'ok' };
  }

  @Public()
  @Get('send')
  async sendMessage() {
    try {
      await this.googlechatService.sendMessageToSpace(
        'spaces/AAQACTK1luY',
        'hello from skribe bot',
      );

      return { message: 'hello' };
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }

  @Public()
  @Get('sendDM')
  async send() {
    try {
      const targetSpace =
        await this.googlechatService.findDMSpaceID_ByEmail(
          'hello@santanup.com',
        );
      await this.googlechatService.sendMessageToUser(
        targetSpace,
        'hello from skribe bot',
      );

      return { message: 'sent' };
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }
}
