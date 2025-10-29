import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentactionlogController } from './contentactionlog.controller';
import { ContentactionlogService } from './contentactionlog.service';
import {
  Contentactionlog,
  ContentactionlogSchema,
} from 'src/schemas/contentactionlog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contentactionlog.name, schema: ContentactionlogSchema },
    ]),
  ],
  controllers: [ContentactionlogController],
  providers: [ContentactionlogService],
  exports: [ContentactionlogService],
})
export class ContentactionlogModule {}
