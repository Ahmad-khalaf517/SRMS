import { type RequestHandler } from 'express';

import { type AuthenticatedRequest } from '@/modules/auth/utils/auth.middleware';
import {
  createMenuItemService,
  deleteMenuItemService,
  getMenuItem,
  listMenuItems,
  toggleMenuItemAvailabilityService,
  updateMenuItemService,
} from '@/modules/menu-item/service/menu-item.service';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { sendSuccess } from '@/shared/http/response';

const getRestaurantId = (req: Parameters<RequestHandler>[0]): string => {
  const auth = (req as AuthenticatedRequest).auth;
  if (!auth?.restaurantId) {
    throw new UnauthorizedError('Missing auth context');
  }

  return auth.restaurantId;
};

export const listMenuItemsController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const menuItems = await listMenuItems(restaurantId, req.query as Record<string, unknown>);
    sendSuccess(res, menuItems, 'Menu items retrieved');
  } catch (error) {
    next(error);
  }
};

export const getMenuItemController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const menuItem = await getMenuItem(restaurantId, req.params.id as string);
    sendSuccess(res, menuItem, 'Menu item retrieved');
  } catch (error) {
    next(error);
  }
};

export const createMenuItemController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const menuItem = await createMenuItemService(restaurantId, req.body);
    sendSuccess(res, menuItem, 'Menu item created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItemController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const menuItem = await updateMenuItemService(restaurantId, req.params.id as string, req.body);
    sendSuccess(res, menuItem, 'Menu item updated');
  } catch (error) {
    next(error);
  }
};

export const toggleMenuItemAvailabilityController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const menuItem = await toggleMenuItemAvailabilityService(
      restaurantId,
      req.params.id as string,
      req.body.isAvailable as boolean,
    );
    sendSuccess(res, menuItem, 'Menu item availability updated');
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItemController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    await deleteMenuItemService(restaurantId, req.params.id as string);
    sendSuccess(res, null, 'Menu item deleted');
  } catch (error) {
    next(error);
  }
};
