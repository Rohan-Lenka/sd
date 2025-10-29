import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import {
  Contentcomment,
  ContentcommentDocument,
} from 'src/schemas/contentcomment.schema';

@Injectable()
export class ContentcommentService extends NestService<
  Contentcomment,
  ContentcommentDocument
> {
  constructor(
    @InjectModel(Contentcomment.name)
    private readonly contentcommentModel: Model<Contentcomment>,
  ) {
    super(contentcommentModel);
  }

  async findCommentsofContent(contentId: string, query: Record<string, any>) {
    const comments = await this._find({ content: contentId, ...query });

    return { comments };
  }
}
