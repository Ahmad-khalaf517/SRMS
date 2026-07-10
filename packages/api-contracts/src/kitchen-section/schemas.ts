import { z } from 'zod';
import { PaginationQuerySchema } from '../http/schemas';

export const CreateKitchenSectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: z.string().trim().max(500, 'Description must be at most 500 characters').optional(),
  isActive: z.boolean().optional(),
});

export const UpdateKitchenSectionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, 'Description must be at most 500 characters')
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0 && Object.values(data).some((v) => v !== undefined),
    {
      message: 'At least one field must be provided',
    },
  );

export const KitchenSectionQuerySchema = PaginationQuerySchema;

export type CreateKitchenSectionDTO = z.infer<typeof CreateKitchenSectionSchema>;
export type UpdateKitchenSectionDTO = z.infer<typeof UpdateKitchenSectionSchema>;
export type KitchenSectionQuery = z.infer<typeof KitchenSectionQuerySchema>;
