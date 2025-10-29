import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';
import { Workflow } from './workflow.schema';
import { Content } from './content.schema';
import {
  workflowApprover,
  workflowApproverValues,
} from 'src/apis/workflow/constants/workflow.approver';

export type contentWorkflowDocument = HydratedDocument<contentWorkflow>;

@Schema({
  timestamps: true,
})
export class contentWorkflow {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Workflow.name,
    required: true,
  })
  workflow: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Content',
    required: true,
  })
  content: Types.ObjectId;

  @Prop([
    {
      stepName: { type: String, required: true },
      approverType: {
        type: String,
        enum: workflowApproverValues,
        required: true,
      },
      approvers: [{ type: String }],
      rule: {
        type: String,
        enum: ['ALL', 'ANY'],
        default: 'ALL',
      },
      order: { type: Number, required: true },
    },
  ])
  steps: {
    stepName: string;
    approverType: workflowApprover;
    approvers: string[];
    rule: 'ALL' | 'ANY';
    order: number;
  }[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
  })
  createdBy: Types.ObjectId;

  // @Prop({
  //   type: SchemaTypes.ObjectId,
  //   ref: Users.name,
  //   default: null
  // })
  // updatedBy?: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
  })
  deletedBy?: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
  })
  deleted?: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date;
}

export const contentWorkflowSchema =
  SchemaFactory.createForClass(contentWorkflow);
