import { Router } from 'express';

import {
  createRestaurantController,
  updateRestaurantController,
  getRestaurantController,
} from '@/modules/restaurants/controller/restaurant.controller';
import { authenticate, authorize } from '@/modules/auth/utils/auth.middleware';
import { validate } from '@/shared/http/middleware';
import {
  RESTAURANT_ENDPOINTS,
  UpdateRestaurantSchema,
  CreateRestaurantSchema,
} from '@srms/api-contracts/restaurant';
import { USER_ROLE } from '@srms/api-contracts/user';

const restaurantRoutes = Router();

restaurantRoutes.post(
  RESTAURANT_ENDPOINTS.BASE,
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: CreateRestaurantSchema }),
  createRestaurantController,
);

restaurantRoutes.patch(
  RESTAURANT_ENDPOINTS.BASE,
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: UpdateRestaurantSchema }),
  updateRestaurantController,
);

restaurantRoutes.get(
  RESTAURANT_ENDPOINTS.BASE,
  authenticate,
  authorize([USER_ROLE.ADMIN, USER_ROLE.CASHIER, USER_ROLE.KITCHEN_STAFF]),
  getRestaurantController,
);

export default restaurantRoutes;
