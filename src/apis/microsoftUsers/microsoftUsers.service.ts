import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import {
  MicrosoftUsers,
  MicrosoftUsersDocument,
} from 'src/schemas/microsoftUsers.schema';

@Injectable()
export class MicrosoftUsersService extends NestService<
  MicrosoftUsers,
  MicrosoftUsersDocument
> {
  constructor(
    @InjectModel(MicrosoftUsers.name)
    private readonly microsoftUsersModel: Model<MicrosoftUsers>,
  ) {
    super(microsoftUsersModel);
  }
}
