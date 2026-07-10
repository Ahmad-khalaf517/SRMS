import { Router } from 'express';

import { authenticate, authorize } from '@/modules/auth/utils/auth.middleware';
import {
  createOrderController,
  getOrderByIdController,
  getOrderMetricsController,
  getTopSellingItemsController,
  listMyOrdersController,
  listOrdersController,
  updateOrderStatusController,
} from '@/modules/orders/controller/orders.controller';
import { validate } from '@/shared/http/middleware';
import {
  CreateOrderSchema,
  OrderFiltersSchema,
  OrderIdParamsSchema,
  OrderMetricsQuerySchema,
  ORDER_ENDPOINTS,
  TopSellingQuerySchema,
  UpdateOrderStatusSchema,
} from '@srms/api-contracts/orders';
import { USER_ROLE } from '@srms/api-contracts/user';

const ordersRoutes = Router();

ordersRoutes.post(
  ORDER_ENDPOINTS.BASE,
  authenticate,
  authorize([USER_ROLE.CASHIER]),
  validate({ body: CreateOrderSchema }),
  createOrderController,
);

ordersRoutes.get(
  ORDER_ENDPOINTS.BASE,
  authenticate,
  authorize([USER_ROLE.ADMIN, USER_ROLE.KITCHEN_STAFF]),
  validate({ query: OrderFiltersSchema }),
  listOrdersController,
);

ordersRoutes.get(
  ORDER_ENDPOINTS.MY,
  authenticate,
  authorize([USER_ROLE.CASHIER]),
  validate({ query: OrderFiltersSchema }),
  listMyOrdersController,
);

ordersRoutes.get(
  ORDER_ENDPOINTS.METRICS,
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ query: OrderMetricsQuerySchema }),
  getOrderMetricsController,
);

ordersRoutes.get(
  ORDER_ENDPOINTS.TOP_SELLING,
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ query: TopSellingQuerySchema }),
  getTopSellingItemsController,
);

ordersRoutes.get(
  ORDER_ENDPOINTS.BY_ID(':id'),
  authenticate,
  authorize([USER_ROLE.ADMIN, USER_ROLE.CASHIER, USER_ROLE.KITCHEN_STAFF]),
  validate({ params: OrderIdParamsSchema }),
  getOrderByIdController,
);

ordersRoutes.patch(
  ORDER_ENDPOINTS.UPDATE_STATUS(':id'),
  authenticate,
  authorize([USER_ROLE.ADMIN, USER_ROLE.KITCHEN_STAFF]),
  validate({ params: OrderIdParamsSchema, body: UpdateOrderStatusSchema }),
  updateOrderStatusController,
);

export default ordersRoutes;
