import { z } from 'zod';
import { CreateCategorySchema, UpdateCategorySchema } from '@srms/api-contracts';

export const CategoryFormSchema = CreateCategorySchema;
export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;

export const EditCategoryFormSchema = UpdateCategorySchema;
export type EditCategoryFormValues = z.infer<typeof EditCategoryFormSchema>;
