import { type RequestHandler } from 'express';

import { type AuthenticatedRequest } from '@/modules/auth/utils/auth.middleware';
import {
  createKitchenSectionService,
  deleteKitchenSectionService,
  listKitchenSections,
  updateKitchenSectionService,
} from '@/modules/kitchen-section/service/kitchen-section.service';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { sendSuccess } from '@/shared/http/response';

const getRestaurantId = (req: Parameters<RequestHandler>[0]): string => {
  const auth = (req as AuthenticatedRequest).auth;
  if (!auth?.restaurantId) {
    throw new UnauthorizedError('Missing auth context');
  }
  return auth.restaurantId;
};

export const listKitchenSectionsController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
    const kitchenSectionList = await listKitchenSections(restaurantId, Number(page), Number(limit));
    sendSuccess(res, kitchenSectionList, 'Kitchen sections retrieved');
  } catch (error) {
    next(error);
  }
};

export const createKitchenSectionController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const kitchenSection = await createKitchenSectionService(restaurantId, req.body);
    sendSuccess(res, kitchenSection, 'Kitchen section created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateKitchenSectionController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = req.params.id as string;
    const kitchenSection = await updateKitchenSectionService(restaurantId, id, req.body);
    sendSuccess(res, kitchenSection, 'Kitchen section updated');
  } catch (error) {
    next(error);
  }
};

export const deleteKitchenSectionController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = req.params.id as string;
    await deleteKitchenSectionService(restaurantId, id);
    sendSuccess(res, null, 'Kitchen section deleted');
  } catch (error) {
    next(error);
  }
};
