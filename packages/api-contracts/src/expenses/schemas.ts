import { z } from 'zod';
import { PaginationQuerySchema } from '../http/schemas';
const expenseNo = z.string().regex(/^EXP-\d{8}-\d{4}$/, 'Invalid expense number format');
const expenseTypeId = z.string().min(1, 'Expense type is required');
const title = z.string().min(3, 'Title must be at least 3 characters').max(150);
const description = z.string().max(500).optional();
const amount = z.number('Amount must be a number').positive('Amount must be greater than zero');
const restaurantId = z.string().min(1, 'Restaurant is required');
const createdBy = z.string().min(1, 'Creator is required');
const date = z.coerce.date();
// Create Schema
export const CreateExpensesSchema = z.object({
  expenseNo: expenseNo,
  expenseTypeId: expenseTypeId,
  title: title,
  description: description,
  amount: amount,
  date: date,
  restaurantId: restaurantId,
  createdBy: createdBy,
});

// Update schema
export const UpdateExpensesSchema = z.object({
  expenseNo: expenseNo.optional(),
  expenseTypeId: expenseTypeId.optional(),
  title: title.optional(),
  description: description.optional(),
  amount: amount.optional(),
  date: date.optional(),
  restaurantId: restaurantId.optional(),
  createdBy: createdBy.optional(),
});
export const ExpensesQuerySchema = PaginationQuerySchema;

export type CreateExpensesDTO = z.infer<typeof CreateExpensesSchema>;
export type UpdateExpensesDTO = z.infer<typeof UpdateExpensesSchema>;
export type ExpensesQuery = z.infer<typeof ExpensesQuerySchema>;
