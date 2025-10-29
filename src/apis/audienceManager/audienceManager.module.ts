import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AudienceManagerService } from './audienceManager.service';
import { AudienceManagerController } from './audienceManager.controller';
import {
  AudienceManager,
  AudienceManagerSchema,
} from 'src/schemas/audienceManager.schema';
import { UsersModule } from 'src/apis/users/users.module';
import { Users, UsersSchema } from 'src/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AudienceManager.name, schema: AudienceManagerSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [AudienceManagerController],
  providers: [AudienceManagerService],
  exports: [AudienceManagerService],
})
export class AudienceManagerModule {}
