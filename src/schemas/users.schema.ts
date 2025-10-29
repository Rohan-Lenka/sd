import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { UserRole, UserRoleValues } from 'src/apis/users/constants/users.role';
import {
  UserGender,
  UserGenderValues,
} from 'src/apis/users/constants/users.gender';
import { UserProviderValues } from 'src/apis/users/constants/user.provider';
// import { Organisation } from './organisation.schema';
import { OrgRole, OrgRoleValues } from 'src/apis/users/constants/user.orgRole';

export type UsersDocument = HydratedDocument<Users>;

@Schema({
  timestamps: true,
})
export class Users {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    trim: true,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    trim: true,
  })
  middleName?: string;

  @Prop({
    type: String,
    trim: true,
    required: true,
  })
  lastName: string;

  @Prop({
    enum: UserGenderValues,
  })
  gender?: UserGender;

  @Prop({
    type: String,
    trim: true,
    unique: true,
    required: true,
  })
  phone: string;

  @Prop({
    type: String,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
  })
  password?: string;

  @Prop({
    type: Number,
    enum: UserRoleValues,
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({
    type: String,
  })
  profileImage?: string;

  @Prop({
    type: String,
  })
  department?: string;

  @Prop({
    type: String,
    enum: UserProviderValues,
    default: null,
  })
  provider?: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Organisation',
  })
  organisation: Types.ObjectId;

  @Prop({
    type: Number,
    enum: OrgRoleValues,
    default: OrgRole.USER,
  })
  orgRole: OrgRole;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'GoogleUsers',
  })
  googleUserMetadata?: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'GoogleTenant',
  })
  googleTenant?: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'MicrosoftUsers',
  })
  microsoftUserMetadata?: Types.ObjectId;

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

export const UsersSchema = SchemaFactory.createForClass(Users);
