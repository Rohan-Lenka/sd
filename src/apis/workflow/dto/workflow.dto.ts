import { z } from 'zod';
import { Types } from 'mongoose';

export const CreateWorkflowValidation = z.object({
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

export const PatchWorkflowValidation = z.object({
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

export const RemoveWorkflowValidation = z.object({
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

export type CreateWorkflowDTO = z.infer<typeof CreateWorkflowValidation>;
export type PatchWorkflowDTO = z.infer<typeof PatchWorkflowValidation>;
export type RemoveWorkflowDTO = z.infer<typeof RemoveWorkflowValidation>;
