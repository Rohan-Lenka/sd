import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';
import { Content } from './content.schema';

export type ContentcommentDocument = HydratedDocument<Contentcomment>;

@Schema({
  timestamps: true,
})
export class Contentcomment {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Content.name,
    required: true,
  })
  content: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  text: string;

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

export const ContentcommentSchema =
  SchemaFactory.createForClass(Contentcomment);
