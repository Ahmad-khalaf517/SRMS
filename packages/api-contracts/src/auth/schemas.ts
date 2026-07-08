import { z } from 'zod';
import { CreateRestaurantSchema } from '../restaurant/schemas';
import { CreateUserSchema } from '../user/schemas';

export const LoginSchema = z.object({
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const RegisterSchema = z.object({
  restaurant: CreateRestaurantSchema,
  user: CreateUserSchema,
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;

export type LoginDTO = z.infer<typeof LoginSchema>;
