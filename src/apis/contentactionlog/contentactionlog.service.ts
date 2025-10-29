import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import {
  Contentactionlog,
  ContentactionlogDocument,
} from 'src/schemas/contentactionlog.schema';

@Injectable()
export class ContentactionlogService extends NestService<
  Contentactionlog,
  ContentactionlogDocument
> {
  constructor(
    @InjectModel(Contentactionlog.name)
    private readonly contentactionlogModel: Model<Contentactionlog>,
  ) {
    super(contentactionlogModel);
  }
}
