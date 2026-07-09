import { Router } from 'express';

import {
  createCategoryController,
  deleteCategoryController,
  listCategoriesController,
  updateCategoryController,
} from '@/modules/categories/controller/category.controller';
import { authenticate, authorize } from '@/modules/auth/utils/auth.middleware';
import { validate } from '@/shared/http/middleware';
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  CategoryQuerySchema,
} from '@srms/api-contracts/categories';
import { USER_ROLE } from '@srms/api-contracts/user';

const categoryRoutes = Router();

categoryRoutes.get(
  '/categories',
  authenticate,
  validate({ query: CategoryQuerySchema }),
  listCategoriesController,
);

categoryRoutes.post(
  '/categories',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: CreateCategorySchema }),
  createCategoryController,
);

categoryRoutes.patch(
  '/categories/:id',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: UpdateCategorySchema }),
  updateCategoryController,
);

categoryRoutes.delete(
  '/categories/:id',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  deleteCategoryController,
);

export default categoryRoutes;
