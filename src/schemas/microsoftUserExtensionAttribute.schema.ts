import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type MicrosoftUserExtensionAttributeDocument =
  HydratedDocument<MicrosoftUserExtensionAttribute>;

@Schema({
  timestamps: true,
})
export class MicrosoftUserExtensionAttribute {}

export const MicrosoftUserExtensionAttributeSchema =
  SchemaFactory.createForClass(MicrosoftUserExtensionAttribute);
