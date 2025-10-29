import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Users } from './users.schema';
import { Content } from './content.schema';
import {
  formfields_lables,
  formfields_lables_values,
  formFieldTypes,
  formfieldTypesValues,
} from 'src/apis/content/constants/formFields.types';
import { Organisation } from './organisation.schema';

export type FormfieldsDocument = HydratedDocument<Formfields>;

@Schema({
  timestamps: true,
})
export class Formfields {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Content.name,
  })
  event: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Organisation.name,
  })
  organisation: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  key: string;

  @Prop({
    type: String,
    enum: formfields_lables_values,
  })
  label: formfields_lables;

  @Prop({
    type: String,
    enum: formfieldTypesValues,
  })
  type: formFieldTypes;

  @Prop({
    type: [String],
  })
  options?: string[];

  @Prop({
    type: Boolean,
    default: false,
  })
  required?: boolean;

  @Prop({
    type: String,
    default: '',
  })
  default?: string;

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

export const FormfieldsSchema = SchemaFactory.createForClass(Formfields);
