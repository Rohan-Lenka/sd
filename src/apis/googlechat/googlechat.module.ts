import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GooglechatController } from './googlechat.controller';
import { GooglechatService } from './googlechat.service';
import {
  Useremail_dmspace,
  Useremail_dmspaceSchema,
} from 'src/schemas/useremail_dmspace.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Useremail_dmspace.name, schema: Useremail_dmspaceSchema },
    ]),
  ],
  controllers: [GooglechatController],
  providers: [GooglechatService],
  exports: [GooglechatService],
})
export class GooglechatModule {}
