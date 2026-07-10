import { z } from 'zod';

export const CreateRestaurantSchema = z.object({
  name: z.string().trim().min(1, 'Restaurant name is required'),
  address: z.string().trim().min(1, 'Restaurant address is required'),
  phone: z.string().trim().min(1, 'Restaurant phone is required'),
  email: z.string().trim().email('Invalid restaurant email'),
  logo: z.string().trim().optional(),
});

export const UpdateRestaurantSchema = z
  .object({
    name: z.string().trim().min(1, 'Restaurant name is required').optional(),
    address: z.string().trim().min(1, 'Restaurant address is required').optional(),
    phone: z.string().trim().min(1, 'Restaurant phone is required').optional(),
    email: z.string().trim().email('Invalid restaurant email').optional(),
    logo: z.string().trim().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0 && Object.values(data).some((v) => v !== undefined),
    {
      message: 'At least one field must be provided',
    },
  );

export type CreateRestaurantDTO = z.infer<typeof CreateRestaurantSchema>;
export type UpdateRestaurantDTO = z.infer<typeof UpdateRestaurantSchema>;
