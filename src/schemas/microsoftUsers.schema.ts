import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';

export type MicrosoftUsersDocument = HydratedDocument<MicrosoftUsers>;

@Schema({
  timestamps: true,
})
export class MicrosoftUsers {
  @Prop([String])
  businessPhones: string[];

  @Prop({ required: true })
  displayName: string;

  @Prop()
  givenName: string;

  @Prop()
  jobTitle?: string;

  @Prop()
  mail?: string;

  @Prop()
  mobilePhone?: string;

  @Prop()
  officeLocation?: string;

  @Prop()
  preferredLanguage?: string;

  @Prop()
  surname: string;

  @Prop({ required: true })
  userPrincipalName: string;

  @Prop({ required: true })
  microsoftId: string;

  @Prop({
    type: String,
  })
  refresh_token?: string;

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

export const MicrosoftUsersSchema =
  SchemaFactory.createForClass(MicrosoftUsers);
