import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Users } from './users.schema';
import { UserRole } from 'src/apis/users/constants/users.role';
import { Organisation } from './organisation.schema';
import EnsureObjectId from '@nest-extended/core/common/ensureObjectId';

export type AudienceManagerDocument = HydratedDocument<AudienceManager>;

@Schema({
  timestamps: true,
})
export class AudienceManager {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Organisation.name,
    set: EnsureObjectId,
  })
  organisation: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: [
      {
        condition: { type: String, enum: ['AND', 'OR'], required: true },
        stage: [
          {
            entityType: {
              type: String,
              enum: ['user', 'role', 'designation', 'ex_at', 'department'],
            },
            entityId: {
              type: SchemaTypes.ObjectId,
              ref: Users.name,
            },
            entityValue: {
              type: String,
              validate: (value: any) => {
                return (
                  Object.values(UserRole).includes(value as UserRole) ||
                  typeof value === 'string'
                );
              },
            },
          },
        ],
      },
    ],
    default: [],
  })
  filters: {
    condition: 'AND' | 'OR';
    stage: {
      entityType: 'user' | 'role' | 'designation' | 'ex_at';
      entityId: Types.ObjectId;
      entityValue: UserRole | string;
    }[];
  }[];
}

export const AudienceManagerSchema =
  SchemaFactory.createForClass(AudienceManager);
