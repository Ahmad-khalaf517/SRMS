import { z } from 'zod';

import { PaginationQuerySchema } from '../http/schemas';
import { ORDER_STATUS } from './constants';

const OrderStatusSchema = z.enum([
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
]);

export const CreateOrderItemSchema = z.object({
  menuItemId: z.string().trim().min(1, 'Menu item is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  notes: z.string().trim().max(300, 'Notes must be at most 300 characters').optional(),
});

export const CreateOrderSchema = z.object({
  items: z.array(CreateOrderItemSchema).min(1, 'At least one item is required'),
});

export const OrderIdParamsSchema = z.object({
  id: z.string().trim().min(1, 'Order id is required'),
});

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema,
});

export const OrderFiltersSchema = PaginationQuerySchema.pick({
  page: true,
  limit: true,
}).extend({
  search: z.string().trim().optional(),
  status: OrderStatusSchema.optional(),
  createdBy: z.string().trim().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const OrderMetricsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const TopSellingQuerySchema = OrderMetricsQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
export type OrderIdParams = z.infer<typeof OrderIdParamsSchema>;
export type UpdateOrderStatusDTO = z.infer<typeof UpdateOrderStatusSchema>;
export type OrderFiltersQuery = z.infer<typeof OrderFiltersSchema>;
export type OrderMetricsQuery = z.infer<typeof OrderMetricsQuerySchema>;
export type TopSellingQuery = z.infer<typeof TopSellingQuerySchema>;
