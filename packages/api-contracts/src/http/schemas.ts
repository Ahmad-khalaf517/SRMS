import { z } from 'zod';

export const EmptyObjectSchema = z.object({});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  total: z.coerce.number().int().min(0).default(0),
  totalPages: z.coerce.number().int().min(0).default(0),
});

export const HealthCheckResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
  timestamp: z.string(),
});

export type PaginationMeta = z.infer<typeof PaginationQuerySchema>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
