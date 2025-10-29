import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import { Workflow, WorkflowDocument } from 'src/schemas/workflow.schema';

@Injectable()
export class WorkflowService extends NestService<Workflow, WorkflowDocument> {
  constructor(
    @InjectModel(Workflow.name) private readonly workflowModel: Model<Workflow>,
  ) {
    super(workflowModel);
  }

  deleteWorfklowTemplate(workflowID: string) {
    try {
      return this.workflowModel.findByIdAndDelete(workflowID);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}
