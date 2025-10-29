import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';
import EnsureObjectId from '@nest-extended/core/common/ensureObjectId';
import { AudienceManager } from './audienceManager.schema';
import {
  ContentStatus,
  ContentStatusValues,
} from '../apis/content/constants/Content.status';
import { Organisation } from './organisation.schema';
// import { contentWorkflow } from './contentWorkflow.schema';
// import { Platformconfig } from './platformconfig.schema';
import { Workflow } from './workflow.schema';
import {
  ContentTypes,
  ContentTypesValues,
} from '../apis/content/constants/ContentTypes';

export type ContentDocument = HydratedDocument<Content>;

@Schema({
  timestamps: true,
})
export class Content {
  @Prop({ trim: true, required: true })
  title: string;

  @Prop({ trim: true, required: true })
  description: string;

  @Prop({ trim: true })
  cover?: string;

  @Prop({ trim: true })
  content?: string;

  @Prop({ trim: true })
  attachments?: string[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Workflow.name,
    default: null,
    set: EnsureObjectId,
  })
  workflow: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: AudienceManager.name,
    default: null,
    set: EnsureObjectId,
  })
  audienceManager: Types.ObjectId;

  @Prop({
    type: String,
    enum: ContentStatusValues,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Prop({
    type: String,
    enum: ContentTypesValues,
    default: ContentTypes.COMMUNICATION,
  })
  type: ContentTypes;

  // @Prop({
  //   type: SchemaTypes.ObjectId,
  //   ref: Platformconfig.name,
  //   required: true,
  //   set: EnsureObjectId,
  // })
  // channel: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Organisation.name,
    required: true,
    set: EnsureObjectId,
  })
  organisation: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
  })
  immediatePublish?: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  scheduledAt?: Date;

  @Prop({
    type: Date,
  })
  endTime?: Date;

  @Prop({
    type: String,
  })
  venue?: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  needsRegistration?: boolean;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
    set: EnsureObjectId,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
    set: EnsureObjectId,
  })
  updatedBy?: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
    set: EnsureObjectId,
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

export const ContentSchema = SchemaFactory.createForClass(Content);
