import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Content, ContentSchema } from 'src/schemas/content.schema';
import { Formfields, FormfieldsSchema } from 'src/schemas/formfields.schema';
import { GooglechatModule } from '../googlechat/googlechat.module';
import { AudienceManagerModule } from '../audienceManager/audienceManager.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
      { name: Formfields.name, schema: FormfieldsSchema },
    ]),
    GooglechatModule,
    AudienceManagerModule,
    UsersModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
