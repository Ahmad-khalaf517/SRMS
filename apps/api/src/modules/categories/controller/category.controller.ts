import { type RequestHandler } from 'express';

import { type AuthenticatedRequest } from '@/modules/auth/utils/auth.middleware';
import {
  createCategoryService,
  deleteCategoryService,
  listCategories,
  updateCategoryService,
} from '@/modules/categories/service/category.service';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { sendSuccess } from '@/shared/http/response';

const getRestaurantId = (req: Parameters<RequestHandler>[0]): string => {
  const auth = (req as AuthenticatedRequest).auth;
  if (!auth?.restaurantId) {
    throw new UnauthorizedError('Missing auth context');
  }
  return auth.restaurantId;
};

export const listCategoriesController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };
    const categoryList = await listCategories(restaurantId, Number(page), Number(limit));
    sendSuccess(res, categoryList, 'Categories retrieved');
  } catch (error) {
    next(error);
  }
};

export const createCategoryController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const category = await createCategoryService(restaurantId, req.body);
    sendSuccess(res, category, 'Category created', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = req.params.id as string;
    const category = await updateCategoryService(restaurantId, id, req.body);
    sendSuccess(res, category, 'Category updated');
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController: RequestHandler = async (req, res, next) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = req.params.id as string;
    await deleteCategoryService(restaurantId, id);
    sendSuccess(res, null, 'Category deleted');
  } catch (error) {
    next(error);
  }
};
