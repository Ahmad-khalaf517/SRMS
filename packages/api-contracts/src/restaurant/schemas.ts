import { z } from 'zod';

export const CreateRestaurantSchema = z.object({
  name: z.string().trim().min(1, 'Restaurant name is required'),
  address: z.string().trim().min(1, 'Restaurant address is required'),
  phone: z.string().trim().min(1, 'Restaurant phone is required'),
  email: z.string().trim().email('Invalid restaurant email'),
});

export type CreateResturantDTO = z.infer<typeof CreateRestaurantSchema>;
