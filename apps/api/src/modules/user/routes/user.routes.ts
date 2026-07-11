import { Router } from 'express';

import {
  createUserController,
  deleteUserController,
  listUserController,
  updateUserController,
} from '@/modules/user/controller/user.controller';
import { authenticate, authorize } from '@/modules/auth/utils/auth.middleware';
import { validate } from '@/shared/http/middleware';
import { CreateUserSchema, UpdateUserSchema, UserQuerySchema } from '@srms/api-contracts/user';
import { USER_ROLE } from '@srms/api-contracts/user';

const userRoutes = Router();

userRoutes.get(
  '/users',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ query: UserQuerySchema }),
  listUserController,
);

userRoutes.post(
  '/users',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: CreateUserSchema }),
  createUserController,
);

userRoutes.patch(
  '/users/:id',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: UpdateUserSchema }),
  updateUserController,
);

userRoutes.delete('/users/:id', authenticate, authorize([USER_ROLE.ADMIN]), deleteUserController);

export default userRoutes;
