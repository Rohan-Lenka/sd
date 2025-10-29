import { Model, Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import {
  contentWorkflow,
  contentWorkflowDocument,
} from 'src/schemas/contentWorkflow.schema';
import { WorkflowService } from '../workflow/workflow.service';
import { Workflow } from 'src/schemas/workflow.schema';
import { ContentService } from '../content/content.service';
import { Workflowstate } from 'src/schemas/workflowstate.schema';
import { Content } from 'src/schemas/content.schema';
import { ContentStatus } from '../content/constants/Content.status';

@Injectable()
export class ContentworkflowService extends NestService<
  contentWorkflow,
  contentWorkflowDocument
> {
  constructor(
    @InjectModel(contentWorkflow.name)
    private readonly contentworkflowModel: Model<contentWorkflow>,
    private readonly workflowService: WorkflowService,
    private readonly contentService: ContentService,
    @InjectModel(Workflowstate.name)
    private readonly workflowStateModel: Model<Workflowstate>,
  ) {
    super(contentworkflowModel);
  }

  async createContentWorkflow(
    workflow: string,
    content: string,
    userId: string,
  ) {
    try {
      const workflowTemplate: Workflow = (
        await this.workflowService._get(workflow)
      )[0];
      if (!workflowTemplate) throw new Error('Invalid workflow ID');

      const contentWorkflow = await this.contentworkflowModel.create({
        workflow,
        content,
        steps: workflowTemplate.steps,
        createdBy: userId,
      });

      return contentWorkflow;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async approveContent(contentID: string, userID: string) {
    try {
      const content = (await this.contentService._get(contentID)) as Content;

      if (!content) {
        console.log('no content found');
        throw new Error('no content found');
      }

      const workflowTemplateID = content.workflow;

      const doesExistwContentWorkflow = await this.contentworkflowModel.findOne(
        {
          content: contentID,
        },
      );

      if (doesExistwContentWorkflow) {
        throw new BadRequestException(
          'Content already sent to approval process',
        );
      }

      const workflow = (await this.workflowService._get(
        String(workflowTemplateID),
      )) as Workflow;

      const contentWorkflowCreted = await this.contentworkflowModel.create({
        workflow: workflowTemplateID,
        steps: workflow.steps,
        createdBy: userID,
        content: contentID,
      });

      const firstStep = contentWorkflowCreted.steps.sort(
        (a, b) => a.order - b.order,
      )[0];

      const firstState = await this.workflowStateModel.create({
        workflow: workflowTemplateID,
        content: contentID,
        contentWorkflow: contentWorkflowCreted._id,
        stepName: firstStep.stepName,
        approverType: firstStep.approverType,
        approverValue: firstStep.approvers,
        rule: firstStep.rule,
        level: firstStep.order,
        isActive: true,
        contentStatus: ContentStatus.PENDING,
      });

      await this.contentService._patch(contentID, {
        status: ContentStatus.PENDING,
      });

      return {
        message: 'Approval process Started',
        contentWorkflow: contentWorkflowCreted,
        firstState: firstState,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
