import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MicrosoftUsersController } from './microsoftUsers.controller';
import { MicrosoftUsersService } from './microsoftUsers.service';
import {
  MicrosoftUsers,
  MicrosoftUsersSchema,
} from 'src/schemas/microsoftUsers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MicrosoftUsers.name, schema: MicrosoftUsersSchema },
    ]),
  ],
  controllers: [MicrosoftUsersController],
  providers: [MicrosoftUsersService],
  exports: [MicrosoftUsersService],
})
export class MicrosoftUsersModule {}
