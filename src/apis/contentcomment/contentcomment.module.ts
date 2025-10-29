import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentcommentController } from './contentcomment.controller';
import { ContentcommentService } from './contentcomment.service';
import {
  Contentcomment,
  ContentcommentSchema,
} from 'src/schemas/contentcomment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contentcomment.name, schema: ContentcommentSchema },
    ]),
  ],
  controllers: [ContentcommentController],
  providers: [ContentcommentService],
  exports: [ContentcommentService],
})
export class ContentcommentModule {}
