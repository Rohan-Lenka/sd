import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';
import { Content } from './content.schema';
import {
  ContentActionType,
  ContentActionTypeValues,
} from 'src/apis/contentactionlog/constant/contentActionType.enum';

export type ContentactionlogDocument = HydratedDocument<Contentactionlog>;

@Schema({
  timestamps: true,
})
export class Contentactionlog {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Content.name,
    required: true,
  })
  content: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    required: true,
  })
  performedBy: Types.ObjectId;

  @Prop({
    type: String,
    enum: ContentActionTypeValues,
    required: true,
  })
  action: ContentActionType;

  @Prop({
    type: String,
    trim: true,
    default: null,
  })
  comment?: string;

  @Prop({
    type: Object,
    default: {},
  })
  metaData: Record<string, any>;
}

export const ContentactionlogSchema =
  SchemaFactory.createForClass(Contentactionlog);
