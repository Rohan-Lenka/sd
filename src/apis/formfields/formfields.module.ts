import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormfieldsController } from './formfields.controller';
import { FormfieldsService } from './formfields.service';
import { Formfields, FormfieldsSchema } from 'src/schemas/formfields.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Formfields.name, schema: FormfieldsSchema },
    ]),
  ],
  controllers: [FormfieldsController],
  providers: [FormfieldsService],
  exports: [FormfieldsService],
})
export class FormfieldsModule {}
