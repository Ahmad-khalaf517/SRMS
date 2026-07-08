import { z } from 'zod';
import { USER_ROLE } from './constants';

export const CreateUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const CreateUserRoleSchema = z.object({
  userId: z.string().trim().min(1, 'User is required'),
  restaurantId: z.string().min(1, 'Restaurant is required'),
  role: z.enum(USER_ROLE),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type CreateUserRoleDTO = z.infer<typeof CreateUserRoleSchema>;
