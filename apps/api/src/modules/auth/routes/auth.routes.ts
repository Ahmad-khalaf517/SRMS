import { Router } from 'express';

import {
  currentUserController,
  loginController,
  logoutController,
  refreshController,
  registerController,
} from '@/modules/auth/controller/auth.controller';
import { authenticate, authorize } from '@/modules/auth/utils/auth.middleware';
import { validate } from '@/shared/http/middleware';
import { RegisterSchema, AUTH_ENDPOINTS, LoginSchema } from '@srms/api-contracts/auth';
import { USER_ROLE } from '@srms/api-contracts/user';

const authRoutes = Router();

authRoutes.post(AUTH_ENDPOINTS.REGISTER, validate({ body: RegisterSchema }), registerController);
authRoutes.post(AUTH_ENDPOINTS.LOGIN, validate({ body: LoginSchema }), loginController);
authRoutes.post(AUTH_ENDPOINTS.REFRESH, refreshController);
authRoutes.post(AUTH_ENDPOINTS.LOGOUT, logoutController);
authRoutes.get(
  AUTH_ENDPOINTS.CURRENT_USER,
  authenticate,
  authorize([USER_ROLE.ADMIN, USER_ROLE.CASHIER, USER_ROLE.KITCHEN_STAFF]),
  currentUserController,
);

export default authRoutes;
