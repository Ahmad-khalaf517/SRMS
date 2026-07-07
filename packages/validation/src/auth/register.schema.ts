import { z } from 'zod';

const RestaurantInputSchema = z.object({
  name: z.string().trim().min(1, 'Restaurant name is required'),
  address: z.string().trim().min(1, 'Restaurant address is required'),
  phone: z.string().trim().min(1, 'Restaurant phone is required'),
  email: z.string().trim().email('Invalid restaurant email'),
});

const RegisterUserInputSchema = z.object({
  name: z.string().trim().min(1, 'Owner name is required'),
  email: z.string().trim().email('Invalid owner email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RegisterSchema = z.object({
  restaurant: RestaurantInputSchema,
  user: RegisterUserInputSchema,
});

export type RegisterSchemaInput = z.infer<typeof RegisterSchema>;
