import { Router } from 'express';

import {
  createExpenseController,
  deleteExpenseController,
  listExpensesController,
  updateExpenseController,
} from '@/modules/expenses/controller/expenses.controller';
import { authenticate, authorize } from '@/modules/auth/utils/auth.middleware';
import { validate } from '@/shared/http/middleware';
import {
  CreateExpensesSchema,
  UpdateExpensesSchema,
  ExpensesQuerySchema,
} from '@srms/api-contracts/expenses';
import { USER_ROLE } from '@srms/api-contracts/user';

const expenseRoutes = Router();

expenseRoutes.get(
  '/expenses',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ query: ExpensesQuerySchema }),
  listExpensesController,
);

expenseRoutes.post(
  '/expenses',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: CreateExpensesSchema }),
  createExpenseController,
);

expenseRoutes.patch(
  '/expenses/:id',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: UpdateExpensesSchema }),
  updateExpenseController,
);

expenseRoutes.delete(
  '/expenses/:id',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  deleteExpenseController,
);

export default expenseRoutes;
