import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentworkflowController } from './contentworkflow.controller';
import { ContentworkflowService } from './contentworkflow.service';
import {
  contentWorkflow,
  contentWorkflowSchema,
} from 'src/schemas/contentWorkflow.schema';
import { WorkflowModule } from '../workflow/workflow.module';
import { ContentModule } from '../content/content.module';
import { WorkflowstateModule } from '../workflowstate/workflowstate.module';
import {
  Workflowstate,
  WorkflowstateSchema,
} from 'src/schemas/workflowstate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: contentWorkflow.name, schema: contentWorkflowSchema },
      { name: Workflowstate.name, schema: WorkflowstateSchema },
    ]),
    WorkflowModule,
    ContentModule,
    WorkflowstateModule,
  ],
  controllers: [ContentworkflowController],
  providers: [ContentworkflowService],
  exports: [ContentworkflowService],
})
export class ContentworkflowModule {}
