import { type RequestHandler } from 'express';

import { type AuthenticatedRequest } from '@/modules/auth/utils/auth.middleware';
import {
  createUserService,
  deleteUserService,
  listUsers,
  updateUserService,
} from '@/modules/user/service/user.service';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { sendSuccess } from '@/shared/http/response';

const getRestaurantId = (req: Parameters<RequestHandler>[0]): string => {
  const auth = (req as AuthenticatedRequest).auth;
  if (!auth?.restaurantId) {
    throw new UnauthorizedError('Missing auth context');
  }
  return auth.restaurantId;
};

export const listUserController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
    const userList = await listUsers(restaurantId, Number(page), Number(limit));
    sendSuccess(res, userList, 'users retrieved');
  } catch (error) {
    next(error);
  }
};

export const createUserController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const user = await createUserService(restaurantId, req.body);
    sendSuccess(res, user, 'User created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateUserController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = req.params.id as string;
    const user = await updateUserService(restaurantId, id, req.body);
    sendSuccess(res, user, 'User updated');
  } catch (error) {
    next(error);
  }
};

export const deleteUserController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = req.params.id as string;
    await deleteUserService(restaurantId, id);
    sendSuccess(res, null, 'user deleted');
  } catch (error) {
    next(error);
  }
};
