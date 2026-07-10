import { z } from 'zod';
import { PaginationQuerySchema } from '../http/schemas';

export const CreateMenuItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must be at most 120 characters'),
  description: z.string().trim().max(500, 'Description must be at most 500 characters').optional(),
  price: z.coerce.number().gt(0, 'Price must be greater than 0'),
  categoryId: z.string().trim().min(1, 'Category is required'),
  kitchenSectionId: z.string().trim().min(1, 'Kitchen section is required'),
  isAvailable: z.boolean().optional().default(true),
});

export const UpdateMenuItemSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(120, 'Name must be at most 120 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, 'Description must be at most 500 characters')
      .optional(),
    price: z.coerce.number().gt(0, 'Price must be greater than 0').optional(),
    categoryId: z.string().trim().min(1, 'Category is required').optional(),
    kitchenSectionId: z.string().trim().min(1, 'Kitchen section is required').optional(),
    isAvailable: z.boolean().optional(),
  })
  .refine(
    (data) =>
      Object.keys(data).length > 0 && Object.values(data).some((value) => value !== undefined),
    {
      message: 'At least one field must be provided',
    },
  );

export const ToggleMenuItemAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const MenuItemIdParamsSchema = z.object({
  id: z.string().trim().min(1, 'Menu item id is required'),
});

export const MenuItemFiltersSchema = PaginationQuerySchema.extend({
  search: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  kitchenSectionId: z.string().trim().optional(),
  isAvailable: z.coerce.boolean().optional(),
});

export type CreateMenuItemDTO = z.infer<typeof CreateMenuItemSchema>;
export type UpdateMenuItemDTO = z.infer<typeof UpdateMenuItemSchema>;
export type ToggleMenuItemAvailabilityDTO = z.infer<typeof ToggleMenuItemAvailabilitySchema>;
export type MenuItemIdParams = z.infer<typeof MenuItemIdParamsSchema>;
export type MenuItemFiltersQuery = z.infer<typeof MenuItemFiltersSchema>;
