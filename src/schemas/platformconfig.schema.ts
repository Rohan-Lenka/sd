import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';
import { Organisation } from './organisation.schema';

export type PlatformconfigDocument = HydratedDocument<Platformconfig>;

@Schema({
  timestamps: true,
})
export class Platformconfig {
  @Prop({
    required: true,
    trim: true,
  })
  name?: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Organisation.name,
    required: true,
  })
  organisation: Types.ObjectId;

  @Prop({ required: true, enum: ['GoogleChat', 'Slack', 'Teams'] })
  channelType: string;

  @Prop({ type: Object, required: true })
  credentials: Record<string, any>;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
  })
  createdBy: Types.ObjectId;

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

export const PlatformconfigSchema =
  SchemaFactory.createForClass(Platformconfig);
