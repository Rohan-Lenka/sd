import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlatformconfigController } from './platformconfig.controller';
import { PlatformconfigService } from './platformconfig.service';
import {
  Platformconfig,
  PlatformconfigSchema,
} from 'src/schemas/platformconfig.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Platformconfig.name, schema: PlatformconfigSchema },
    ]),
  ],
  controllers: [PlatformconfigController],
  providers: [PlatformconfigService],
  exports: [PlatformconfigService],
})
export class PlatformconfigModule {}
