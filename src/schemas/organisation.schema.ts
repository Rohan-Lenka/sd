import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';

export type OrganisationDocument = HydratedDocument<Organisation>;

@Schema({
  timestamps: true,
})
export class Organisation {
  @Prop({ trim: true })
  name?: string;

  @Prop({ type: String, default: null })
  displayName?: string;

  @Prop({ type: [String], default: [] })
  domains?: string[];

  @Prop({ type: String, required: true })
  primaryDomain: string;

  @Prop({ type: String, default: null })
  phoneNumber?: string;

  @Prop({ type: String, default: null })
  website?: string;

  @Prop({ type: String, default: null })
  timezone?: string;

  @Prop({
    type: String,
    default: 'active',
    enum: ['active', 'suspended'],
  })
  status?: string;

  @Prop({
    type: Date,
    default: () => new Date(),
  })
  lastSynced: Date;

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

export const OrganisationSchema = SchemaFactory.createForClass(Organisation);
