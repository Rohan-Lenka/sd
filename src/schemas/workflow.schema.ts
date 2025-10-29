import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import {
  workflowApprover,
  workflowApproverValues,
} from 'src/apis/workflow/constants/workflow.approver';
import {
  workflowTypes,
  workflowTypesValues,
} from 'src/apis/workflow/constants/workflow.types';
import { Users } from './users.schema';
import { Organisation } from './organisation.schema';
import EnsureObjectId from '@nest-extended/core/common/ensureObjectId';

export type WorkflowDocument = HydratedDocument<Workflow>;

@Schema({ timestamps: true })
export class Workflow {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    enum: workflowTypesValues,
    required: true,
  })
  type: workflowTypes;

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
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Organisation.name,
    set: EnsureObjectId,
  })
  organisation: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
  })
  createdBy?: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
  })
  updatedBy?: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
  })
  deletedBy?: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: null,
  })
  deleted?: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date;
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow);
