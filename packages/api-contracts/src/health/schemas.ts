import { z } from 'zod';

export const HealthQuerySchema = z.object({});

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('api'),
  timestamp: z.string(),
  uptimeSeconds: z.number().int().nonnegative(),
});
