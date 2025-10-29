import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkflowstateController } from './workflowstate.controller';
import { WorkflowstateService } from './workflowstate.service';
import {
  Workflowstate,
  WorkflowstateSchema,
} from 'src/schemas/workflowstate.schema';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workflowstate.name, schema: WorkflowstateSchema },
    ]),
    ContentModule,
  ],
  controllers: [WorkflowstateController],
  providers: [WorkflowstateService],
  exports: [WorkflowstateService],
})
export class WorkflowstateModule {}
