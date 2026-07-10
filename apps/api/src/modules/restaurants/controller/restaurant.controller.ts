import { type RequestHandler } from 'express';

import { type AuthenticatedRequest } from '@/modules/auth/utils/auth.middleware';
import {
  createRestaurantService,
  updateRestaurantService,
  findRestaurantByIdService,
} from '@/modules/restaurants/service/restaurant.service';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { sendSuccess } from '@/shared/http/response';
import { Restaurant } from '@srms/api-contracts';

export const getRestaurantController = async (
  req: Parameters<RequestHandler>[0],
): Promise<Restaurant> => {
  const auth = (req as AuthenticatedRequest).auth;
  if (!auth?.restaurantId) {
    throw new UnauthorizedError('Missing auth context');
  }

  const restaurant = await findRestaurantByIdService(auth?.restaurantId);

  return restaurant;
};

export const createRestaurantController: RequestHandler = async (req, res, next) => {
  try {
    const restaurant = await createRestaurantService(req.body);
    sendSuccess(res, restaurant, 'Restaurant created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateRestaurantController: RequestHandler = async (req, res, next) => {
  try {
    const restaurant = await getRestaurantController(req);
    const updatedRestaurant = await updateRestaurantService(restaurant.id, req.body);
    sendSuccess(res, updatedRestaurant, 'Restaurant updated');
  } catch (error) {
    next(error);
  }
};
