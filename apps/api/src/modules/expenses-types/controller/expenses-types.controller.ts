import { type RequestHandler } from 'express';

import { type AuthenticatedRequest } from '@/modules/auth/utils/auth.middleware';
import {
  createExpensesTypesService,
  deleteExpensesTypesService,
  listExpensesTypes,
  updateExpensesTypesService,
} from '@/modules/expenses-types/service/expenses-types.service';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { sendSuccess } from '@/shared/http/response';

const getRestaurantId = (req: Parameters<RequestHandler>[0]): string => {
  const auth = (req as AuthenticatedRequest).auth;
  if (!auth?.restaurantId) {
    throw new UnauthorizedError('Missing auth context');
  }
  return auth.restaurantId;
};

export const listExpensesTypesController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
    const expensesTypesList = await listExpensesTypes(restaurantId, Number(page), Number(limit));
    sendSuccess(res, expensesTypesList, 'Expenses Types retrieved');
  } catch (error) {
    next(error);
  }
};

export const createExpensesTypesController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const expensesType = await createExpensesTypesService(restaurantId, req.body);
    sendSuccess(res, expensesType, 'Expenses Type created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateExpensesTypesController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = req.params.id as string;
    const expensesType = await updateExpensesTypesService(restaurantId, id, req.body);
    sendSuccess(res, expensesType, 'Expenses Type updated');
  } catch (error) {
    next(error);
  }
};

export const deleteExpensesTypesController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = req.params.id as string;
    await deleteExpensesTypesService(restaurantId, id);
    sendSuccess(res, null, 'Expenses Type deleted');
  } catch (error) {
    next(error);
  }
};
