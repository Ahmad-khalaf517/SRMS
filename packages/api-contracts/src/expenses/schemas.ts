import { z } from 'zod';
import { PaginationQuerySchema } from '../http/schemas';
const expenseTypeId = z.string().min(1, 'Expense type is required');
const title = z.string().min(3, 'Title must be at least 3 characters').max(150);
const description = z.string().max(500).optional();
const amount = z.number('Amount must be a number').positive('Amount must be greater than zero');
const date = z.string().min(10, 'Date is required');
// Create Schema
export const CreateExpensesSchema = z.object({
  expenseTypeId: expenseTypeId,
  title: title,
  description: description,
  amount: amount,
  date: date,
});

// Update schema
export const UpdateExpensesSchema = z.object({
  expenseTypeId: expenseTypeId.optional(),
  title: title.optional(),
  description: description.optional(),
  amount: amount.optional(),
  date: date.optional(),
});
export const ExpensesQuerySchema = PaginationQuerySchema;

export type CreateExpensesDTO = z.infer<typeof CreateExpensesSchema>;
export type UpdateExpensesDTO = z.infer<typeof UpdateExpensesSchema>;
export type ExpensesQuery = z.infer<typeof ExpensesQuerySchema>;
