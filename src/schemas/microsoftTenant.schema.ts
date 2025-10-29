import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';

export type MicrosoftTenantDocument = HydratedDocument<MicrosoftTenant>;

@Schema({ timestamps: true })
export class MicrosoftTenant {
  @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, default: null })
  createdBy?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, default: null })
  updatedBy?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, default: null })
  deletedBy?: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({
    required: true,
  })
  id: string;

  @Prop({ default: null })
  deletedDateTime?: Date;

  @Prop({ type: [String], default: [] })
  businessPhones?: string[];

  @Prop({ default: null })
  city?: string;

  @Prop({ default: null })
  country?: string;

  @Prop({ default: null })
  countryLetterCode?: string;

  @Prop({ default: null })
  createdDateTime?: Date;

  @Prop({ default: null })
  defaultUsageLocation?: string;

  @Prop()
  displayName: string;

  @Prop({ default: null })
  isMultipleDataLocationsForServicesEnabled?: boolean;

  @Prop({ type: [String], default: [] })
  marketingNotificationEmails?: string[];

  @Prop({ default: null })
  onPremisesLastSyncDateTime?: Date;

  @Prop({ default: null })
  onPremisesSyncEnabled?: boolean;

  @Prop({ default: null })
  partnerTenantType?: string;

  @Prop({ default: null })
  postalCode?: string;

  @Prop({ default: null })
  preferredLanguage?: string;

  @Prop({ type: [String], default: [] })
  securityComplianceNotificationMails?: string[];

  @Prop({ type: [String], default: [] })
  securityComplianceNotificationPhones?: string[];

  @Prop({ default: null })
  state?: string;

  @Prop({ default: null })
  street?: string;

  @Prop({ type: [String], default: [] })
  technicalNotificationMails?: string[];

  @Prop()
  tenantType: string;

  @Prop({ type: Object, default: {} })
  directorySizeQuota?: {
    used: number;
    total: number;
  };

  @Prop({ type: Object, default: null })
  privacyProfile?: Record<string, any>;

  @Prop({ type: [Object], default: [] })
  assignedPlans?: Record<string, any>[];

  @Prop({ type: [Object], default: [] })
  onPremisesSyncStatus?: Record<string, any>[];

  @Prop({ type: [Object], default: [] })
  provisionedPlans?: Record<string, any>[];

  @Prop({ type: [Object], default: [] })
  verifiedDomains?: {
    capabilities: string;
    isDefault: boolean;
    isInitial: boolean;
    name: string;
    type: string;
  }[];
}

export const MicrosoftTenantSchema =
  SchemaFactory.createForClass(MicrosoftTenant);
