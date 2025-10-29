import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';

export type Useremail_dmspaceDocument = HydratedDocument<Useremail_dmspace>;

@Schema({
  timestamps: true,
})
export class Useremail_dmspace {
  @Prop({
    type: String,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
  })
  dmSpaceID: any;

  @Prop({
    type: String,
    trim: true,
  })
  spaceType: string;

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

export const Useremail_dmspaceSchema =
  SchemaFactory.createForClass(Useremail_dmspace);
