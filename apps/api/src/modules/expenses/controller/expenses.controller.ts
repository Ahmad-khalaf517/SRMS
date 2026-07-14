import { type RequestHandler } from 'express';

import { type AuthenticatedRequest } from '@/modules/auth/utils/auth.middleware';
import {
  createExpenseService,
  deleteExpenseService,
  listExpenses,
  updateExpenseService,
} from '@/modules/expenses/service/expenses.service';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { sendSuccess } from '@/shared/http/response';

const getRestaurantId = (req: Parameters<RequestHandler>[0]): string => {
  const auth = (req as AuthenticatedRequest).auth;
  if (!auth?.restaurantId) {
    throw new UnauthorizedError('Missing auth context');
  }
  return auth.restaurantId;
};

export const listExpensesController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
    const expenseList = await listExpenses(restaurantId, Number(page), Number(limit));
    sendSuccess(res, expenseList, 'Expenses retrieved');
  } catch (error) {
    next(error);
  }
};

export const createExpenseController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const expense = await createExpenseService(restaurantId, req.body);
    sendSuccess(res, expense, 'Expense created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateExpenseController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = req.params.id as string;
    const expense = await updateExpenseService(restaurantId, id, req.body);
    sendSuccess(res, expense, 'Expense updated');
  } catch (error) {
    next(error);
  }
};

export const deleteExpenseController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = req.params.id as string;
    await deleteExpenseService(restaurantId, id);
    sendSuccess(res, null, 'Expense deleted');
  } catch (error) {
    next(error);
  }
};
