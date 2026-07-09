import { z } from 'zod';
import { USER_ROLE } from './constants';
import { PaginationQuerySchema } from '../http/schemas';

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

export const UpdateUserRoleSchema = z
  .object({
    restaurantId: z.string().min(1, 'Restaurant is required').optional(),
    role: z.enum(USER_ROLE).optional(),
  })

  .refine(
    (data) => Object.keys(data).length > 0 && Object.values(data).some((v) => v !== undefined),
    {
      message: 'At least one field must be provided',
    },
  );

export const UpdateUserSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').optional(),
    email: z.string().trim().email('Invalid email').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0 && Object.values(data).some((v) => v !== undefined),
    {
      message: 'At least one field must be provided',
    },
  );
export const UserQuerySchema = PaginationQuerySchema;

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type CreateUserRoleDTO = z.infer<typeof CreateUserRoleSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type UpdateUserRoleDTO = z.infer<typeof UpdateUserRoleSchema>;
export type UserQuery = z.infer<typeof UserQuerySchema>;
