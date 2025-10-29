import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import {
  Platformconfig,
  PlatformconfigDocument,
} from 'src/schemas/platformconfig.schema';

@Injectable()
export class PlatformconfigService extends NestService<
  Platformconfig,
  PlatformconfigDocument
> {
  constructor(
    @InjectModel(Platformconfig.name)
    private readonly platformconfigModel: Model<Platformconfig>,
  ) {
    super(platformconfigModel);
  }
}
