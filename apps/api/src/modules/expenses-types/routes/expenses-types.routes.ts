import { Router } from 'express';

import {
  createExpensesTypesController,
  deleteExpensesTypesController,
  listExpensesTypesController,
  updateExpensesTypesController,
} from '@/modules/expenses-types/controller/expenses-types.controller';
import { authenticate, authorize } from '@/modules/auth/utils/auth.middleware';
import { validate } from '@/shared/http/middleware';
import {
  CreateExpensesTypesSchema,
  UpdateExpensesTypesSchema,
  ExpensesTypesQuerySchema,
} from '@srms/api-contracts/expenses-types';
import { USER_ROLE } from '@srms/api-contracts/user';

const expensesTypesRoutes = Router();

expensesTypesRoutes.get(
  '/expenses-types',
  authenticate,
  validate({ query: ExpensesTypesQuerySchema }),
  listExpensesTypesController,
);

expensesTypesRoutes.post(
  '/expenses-types',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: CreateExpensesTypesSchema }),
  createExpensesTypesController,
);

expensesTypesRoutes.patch(
  '/expenses-types/:id',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: UpdateExpensesTypesSchema }),
  updateExpensesTypesController,
);

expensesTypesRoutes.delete(
  '/expenses-types/:id',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  deleteExpensesTypesController,
);

export default expensesTypesRoutes;
