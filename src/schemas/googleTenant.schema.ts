import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';
import { Organisation } from './organisation.schema';

export type GoogleTenantDocument = HydratedDocument<GoogleTenant>;

@Schema({ timestamps: true })
export class GoogleTenant {
  _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Organisation.name,
  })
  organisaiton?: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  customerId: string;

  @Prop({
    type: String,
    default: null,
  })
  etag?: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  customerDomain: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  superAdminEmail: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Users.name,
    default: null,
  })
  superAdmin: Types.ObjectId;

  @Prop({
    default: null,
  })
  alternateEmail?: string;

  @Prop({
    type: {
      contactName: { type: String, default: null },
      organizationName: { type: String, default: null },
      addressLine1: { type: String, default: null },
      addressLine2: { type: String, default: null },
      addressLine3: { type: String, default: null },
      locality: { type: String, default: null },
      region: { type: String, default: null },
      postalCode: { type: String, default: null },
      countryCode: { type: String, default: null },
    },
    default: {},
    _id: false,
  })
  postalAddress?: {
    contactName?: string;
    organizationName?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    locality?: string;
    region?: string;
    postalCode?: string;
    countryCode?: string;
  };

  @Prop({
    type: String,
    default: null,
  })
  language?: string;

  @Prop({
    type: Date,
    default: null,
  })
  customerCreationTime?: Date;

  @Prop({
    type: String,
    default: null,
  })
  phoneNumber?: string;

  @Prop({
    type: String,
    required: true,
  })
  refreshToken: string;

  @Prop({
    type: [String],
    default: [],
  })
  scopes?: string[];

  @Prop({
    type: Date,
    default: null,
  })
  lastAuthDate?: Date;

  @Prop({
    type: Object,
  })
  customSchemas: Record<string, any>;

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
    default: false,
  })
  deleted?: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date;
}

export const GoogleTenantSchema = SchemaFactory.createForClass(GoogleTenant);
