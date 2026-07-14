import {
  type Expenses,
  type ExpensesList,
  type CreateExpensesDTO,
  type UpdateExpensesDTO,
} from '@srms/api-contracts';
import {
  createExpense as dbCreateExpense,
  deleteExpenseById,
  findExpensesByRestaurant,
  findExpenseById,
  updateExpenseById,
} from '@/modules/expenses/repository/expenses.repository';
import { NotFoundError } from '@/shared/errors/app-error';
import type { ExpenseDocument } from '@/modules/expenses/repository/expenses.repository';

const toDTO = (doc: ExpenseDocument): Expenses => ({
  id: doc._id.toString(),
  expenseNo: doc.expenseNo as string,
  expenseTypeId: doc.expenseTypeId as string,
  title: doc.title as string,
  description: doc.description as string | undefined,
  amount: doc.amount as number,
  date: (doc.date as Date).toISOString(),
  restaurantId: doc.restaurantId.toString(),
  createdBy: doc.createdBy.toString(),
  createdAt: (doc.createdAt as Date).toISOString(),
  updatedAt: (doc.updatedAt as Date).toISOString(),
});

export const listExpenses = async (
  restaurantId: string,
  page: number,
  limit: number,
): Promise<ExpensesList> => {
  const { docs, total } = await findExpensesByRestaurant(restaurantId, page, limit);
  const totalPages = Math.ceil(total / limit);
  return {
    data: docs.map(toDTO),
    pagination: { page, limit, total, totalPages },
  };
};

export const createExpenseService = async (
  restaurantId: string,
  dto: CreateExpensesDTO,
): Promise<Expenses> => {
  const doc = await dbCreateExpense({
    expenseNo: dto.expenseNo.trim(),
    expenseTypeId: dto.expenseTypeId.trim(),
    title: dto.title.trim(),
    description: dto.description?.trim(),
    amount: dto.amount,
    date: dto.date ?? new Date(),
    restaurantId,
    createdBy: dto.createdBy,
  });
  return toDTO(doc);
};

export const updateExpenseService = async (
  restaurantId: string,
  id: string,
  dto: UpdateExpensesDTO,
): Promise<Expenses> => {
  const existing = await findExpenseById(id, restaurantId);
  if (!existing) {
    throw new NotFoundError('Expense not found');
  }

  if (dto.expenseNo !== undefined) {
    dto = { ...dto, expenseNo: dto.expenseNo.trim() };
  }

  if (dto.expenseTypeId !== undefined) {
    dto = { ...dto, expenseTypeId: dto.expenseTypeId.trim() };
  }

  if (dto.title !== undefined) {
    dto = { ...dto, title: dto.title.trim() };
  }

  if (dto.description !== undefined) {
    dto = { ...dto, description: dto.description.trim() };
  }

  const updated = await updateExpenseById(id, restaurantId, dto);
  if (!updated) {
    throw new NotFoundError('Expense not found');
  }
  return toDTO(updated);
};

export const deleteExpenseService = async (restaurantId: string, id: string): Promise<void> => {
  const deleted = await deleteExpenseById(id, restaurantId);
  if (!deleted) {
    throw new NotFoundError('Expense not found');
  }
};
