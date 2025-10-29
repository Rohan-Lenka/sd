import { z } from 'zod';
import { Types } from 'mongoose';

export const CreateGooglechatValidation = z.object({
  name: z.string().optional(),
  createdBy: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid creator ID',
    })
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deleted: z.boolean().optional().default(false),
  deletedBy: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid deleter ID',
    })
    .optional(),
  deletedAt: z.date().optional(),
});

export const PatchGooglechatValidation = z.object({
  name: z.string().optional(),
  updatedAt: z.date().optional(),
  createdAt: z.date().optional(),
  deleted: z.boolean().optional(),
  deletedBy: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid deleter ID',
    })
    .optional(),
  deletedAt: z.date().optional(),
});

export const RemoveGooglechatValidation = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid user ID',
  }),
  deletedBy: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid deleter ID',
    })
    .optional(),
  deletedAt: z.date().optional(),
});

export type CreateGooglechatDTO = z.infer<typeof CreateGooglechatValidation>;
export type PatchGooglechatDTO = z.infer<typeof PatchGooglechatValidation>;
export type RemoveGooglechatDTO = z.infer<typeof RemoveGooglechatValidation>;
