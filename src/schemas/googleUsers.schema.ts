import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';

export type GoogleUsersDocument = HydratedDocument<GoogleUsers>;

@Schema({
  timestamps: true,
})
export class GoogleUsers {
  @Prop({
    type: String,
    default: null,
  })
  sub: string;

  @Prop({
    type: String,
    required: true,
  })
  directoryId: string;

  @Prop({
    type: String,
    default: null,
  })
  etag?: string;

  @Prop({
    type: String,
    required: true,
  })
  primaryEmail: string;

  @Prop({
    type: String,
  })
  recoveryEmail: string;

  @Prop({
    type: String,
  })
  recoveryPhone: string;

  @Prop({
    _id: false,
    type: {
      givenName: String,
      familyName: String,
      fullName: String,
    },
    required: true,
  })
  name: {
    givenName: string;
    familyName: string;
    fullName: string;
  };

  @Prop({
    default: false,
  })
  isAdmin: boolean;

  @Prop({
    default: false,
  })
  isDelegatedAdmin: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  lastLoginTime: Date;

  @Prop({
    type: Date,
    default: null,
  })
  creationTime: Date;

  @Prop({
    default: false,
  })
  agreedToTerms: boolean;

  @Prop({
    default: false,
  })
  suspended: boolean;

  @Prop({
    default: false,
  })
  archived: boolean;

  @Prop({
    default: false,
  })
  changePasswordAtNextLogin: boolean;

  @Prop({
    default: false,
  })
  ipWhitelisted: boolean;

  @Prop([
    {
      _id: false,
      address: { type: String, required: true },
      primary: { type: Boolean },
    },
  ])
  emails: { address: string; primary?: boolean }[];

  @Prop([
    {
      _id: false,
      languageCode: String,
      preference: String,
    },
  ])
  languages: { languageCode: string; preference: string }[];

  @Prop([String])
  aliases: string[];

  @Prop([String])
  nonEditableAliases: string[];

  @Prop({
    type: String,
    required: true,
  })
  customerId: string;

  @Prop({
    type: String,
  })
  orgUnitPath: string;

  @Prop({
    default: false,
  })
  isMailboxSetup: boolean;

  @Prop({
    default: false,
  })
  isEnrolledIn2Sv?: boolean;

  @Prop({
    default: false,
  })
  isEnforcedIn2Sv?: boolean;

  @Prop({
    default: false,
  })
  includeInGlobalAddressList?: boolean;

  @Prop({
    type: String,
  })
  thumbnailPhotoUrl: string;

  @Prop({
    type: String,
  })
  thumbnailPhotoEtag: string;

  @Prop({
    type: String,
  })
  refreshToken?: string;

  @Prop({ type: Object, default: {} })
  customSchemas: Record<string, Record<string, any>>;

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

export const GoogleUsersSchema = SchemaFactory.createForClass(GoogleUsers);
