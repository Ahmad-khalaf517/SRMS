import { type RegisterRequest } from '@srms/types/auth/register';
import { RegisterSchema } from '@srms/validation/auth/register';
import { z } from 'zod';

export const SignupFormSchema = RegisterSchema.extend({
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.user.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

export const mapSignupToRegisterPayload = (values: SignupFormValues): RegisterRequest => ({
  restaurant: values.restaurant,
  user: values.user,
});
