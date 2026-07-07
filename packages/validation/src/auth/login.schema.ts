import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginSchemaInput = z.infer<typeof LoginSchema>;
