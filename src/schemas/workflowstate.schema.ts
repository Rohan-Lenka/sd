import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';
import { Workflow } from './workflow.schema';
import { Content } from './content.schema';
import { contentWorkflow } from './contentWorkflow.schema';
import {
  workflowApprover,
  workflowApproverValues,
} from 'src/apis/workflow/constants/workflow.approver';
import {
  workflowStateStatus,
  workflowStateStatusValues,
} from 'src/apis/workflowstate/constants/workflowStatesStatus.enum';
import {
  ContentStatus,
  ContentStatusValues,
} from 'src/apis/content/constants/Content.status';

export type WorkflowstateDocument = HydratedDocument<Workflowstate>;

@Schema({
  timestamps: true,
})
export class Workflowstate {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Workflow.name,
    required: true,
  })
  workflow: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Content.name,
    default: null,
  })
  content?: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: contentWorkflow.name,
    default: null,
  })
  contentWorkflow?: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  stepName: string;

  @Prop({
    type: String,
  })
  description?: string;

  @Prop({
    type: String,
    enum: workflowApproverValues,
  })
  approverType?: workflowApprover;

  @Prop({
    type: [String],
  })
  approverValue?: string[];

  @Prop({
    type: String,
    enum: ['ALL', 'ANY'],
  })
  rule?: 'ALL' | 'ANY';

  @Prop({
    type: Number,
    required: true,
  })
  level: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isActive: boolean;

  @Prop({
    type: String,
    enum: ContentStatusValues,
    default: ContentStatus.DRAFT,
  })
  contentStatus: ContentStatus;

  @Prop({
    type: String,
    enum: workflowStateStatusValues,
    default: workflowStateStatus.PENDING,
  })
  eventStatus?: workflowStateStatus;

  @Prop({
    type: String,
  })
  comment?: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
  })
  actionBy?: Types.ObjectId;

  @Prop({
    type: Date,
    default: null,
  })
  actionAt?: Date;

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

export const WorkflowstateSchema = SchemaFactory.createForClass(Workflowstate);
