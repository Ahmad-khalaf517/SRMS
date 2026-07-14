import { z } from 'zod';
import { PaginationQuerySchema } from '../http/schemas';
export const CreateExpensesTypesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  code: z
    .string()
    .trim()
    .min(1, 'Code must be at least 1 character')
    .max(6, 'Code must be at most 6 characters'),
  description: z.string().trim().max(500, 'Description must be at most 500 characters').optional(),
  color: z
    .string()
    .trim()
    .min(3, 'Code must be at least 3 characters')
    .max(20, 'Code must be at most 20 characters'),
  icon: z
    .string()
    .trim()
    .min(3, 'Code must be at least 3 characters')
    .max(20, 'Code must be at most 20 characters'),
  isActive: z.boolean().default(true),
});

export const UpdateExpensesTypesSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .optional(),
    code: z
      .string()
      .trim()
      .min(1, 'Code must be at least 1 character')
      .max(6, 'Code must be at most 6 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, 'Description must be at most 500 characters')
      .optional(),
    color: z
      .string()
      .trim()
      .min(3, 'Code must be at least 3 characters')
      .max(20, 'Code must be at most 20 characters')
      .optional(),
    icon: z
      .string()
      .trim()
      .min(3, 'Code must be at least 3 characters')
      .max(20, 'Code must be at most 20 characters')
      .optional(),
    isActive: z.boolean().default(true).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0 && Object.values(data).some((v) => v !== undefined),
    {
      message: 'At least one field must be provided',
    },
  );

export const ExpensesTypesQuerySchema = PaginationQuerySchema;

export type CreateExpensesTypesDTO = z.infer<typeof CreateExpensesTypesSchema>;
export type UpdateExpensesTypesDTO = z.infer<typeof UpdateExpensesTypesSchema>;
export type CategoryQuery = z.infer<typeof ExpensesTypesQuerySchema>;
