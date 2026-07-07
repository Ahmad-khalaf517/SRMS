import { UserRole } from '@srms/types/users/user-role';
import { LoginSchema, RegisterSchema } from '@srms/validation/auth';
import { Router } from 'express';

import {
  currentUserController,
  loginController,
  refreshController,
  registerController,
} from '@/modules/auth/controller/auth.controller';
import { authenticate, authorize } from '@/modules/auth/utils/auth.middleware';
import { validate } from '@/shared/http/middleware';

const authRoutes = Router();

authRoutes.post('/auth/register', validate({ body: RegisterSchema }), registerController);
authRoutes.post('/auth/login', validate({ body: LoginSchema }), loginController);
authRoutes.post('/auth/refresh', refreshController);
authRoutes.get(
  '/auth/me',
  authenticate,
  authorize([UserRole.ADMIN, UserRole.CASHIER, UserRole.KITCHEN_STAFF]),
  currentUserController,
);

export default authRoutes;
