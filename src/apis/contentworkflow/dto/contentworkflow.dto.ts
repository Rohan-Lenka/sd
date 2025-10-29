import { z } from 'zod';
import { Types } from 'mongoose';

export const createContentWorkflowValidation = z.object({
  workflow: z.string().refine((val) => Types.ObjectId.isValid(val)),
  content: z.string().refine((val) => Types.ObjectId.isValid(val)),
});

// export const CreateContentworkflowValidation = z.object({
//   name: z.string().optional(),
//   createdBy: z
//     .string()
//     .refine((val) => Types.ObjectId.isValid(val), {
//       message: 'Invalid creator ID',
//     })
//     .optional(),
//   createdAt: z.date().optional(),
//   //updatedAt: z.date().optional(),
//   deleted: z.boolean().optional().default(false),
//   deletedBy: z
//     .string()
//     .refine((val) => Types.ObjectId.isValid(val), {
//       message: 'Invalid deleter ID',
//     })
//     .optional(),
//   deletedAt: z.date().optional(),
// });

export const PatchContentworkflowValidation = z.object({
  name: z.string().optional(),
  //updatedAt: z.date().optional(),
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

export const RemoveContentworkflowValidation = z.object({
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

export type CreateContentworkflowDTO = z.infer<
  typeof createContentWorkflowValidation
>;
//export type CreateContentworkflowDTO = z.infer<typeof CreateContentworkflowValidation>;
export type PatchContentworkflowDTO = z.infer<
  typeof PatchContentworkflowValidation
>;
export type RemoveContentworkflowDTO = z.infer<
  typeof RemoveContentworkflowValidation
>;
