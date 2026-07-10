import { type RequestHandler } from 'express';

import { type AuthenticatedRequest } from '@/modules/auth/utils/auth.middleware';
import {
  createOrderService,
  getOrderByIdService,
  getOrderMetricsService,
  getTopSellingItemsService,
  listMyOrdersService,
  listOrdersService,
  updateOrderStatusService,
} from '@/modules/orders/service/orders.service';
import logger from '@/shared/logging/logger';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { sendSuccess } from '@/shared/http/response';

const getAuth = (req: Parameters<RequestHandler>[0]) => {
  const auth = (req as AuthenticatedRequest).auth;
  if (!auth?.restaurantId || !auth.userId) {
    throw new UnauthorizedError('Missing auth context');
  }

  return auth;
};

export const createOrderController: RequestHandler = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const order = await createOrderService(auth.restaurantId, auth.userId, req.body);

    logger.info(
      {
        event: 'order.created',
        orderId: order.id,
        orderNumber: order.orderNumber,
        restaurantId: auth.restaurantId,
        createdBy: auth.userId,
        status: order.status,
      },
      'Order created successfully',
    );

    sendSuccess(res, order, 'Order created', 201);
  } catch (error) {
    next(error);
  }
};

export const listOrdersController: RequestHandler = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const orders = await listOrdersService(auth.restaurantId, req.query as Record<string, unknown>);
    sendSuccess(res, orders, 'Orders retrieved');
  } catch (error) {
    next(error);
  }
};

export const listMyOrdersController: RequestHandler = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const orders = await listMyOrdersService(
      auth.restaurantId,
      auth.userId,
      req.query as Record<string, unknown>,
    );
    sendSuccess(res, orders, 'My orders retrieved');
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdController: RequestHandler = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const order = await getOrderByIdService(auth.restaurantId, req.params.id as string);
    sendSuccess(res, order, 'Order retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusController: RequestHandler = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const previousOrder = await getOrderByIdService(auth.restaurantId, req.params.id as string);
    const order = await updateOrderStatusService(
      auth.restaurantId,
      req.params.id as string,
      req.body,
    );

    logger.info(
      {
        event: 'order.status.transitioned',
        orderId: order.id,
        orderNumber: order.orderNumber,
        fromStatus: previousOrder.status,
        toStatus: order.status,
        restaurantId: auth.restaurantId,
        actorId: auth.userId,
      },
      'Order status transitioned',
    );

    sendSuccess(res, order, 'Order status updated');
  } catch (error) {
    next(error);
  }
};

export const getOrderMetricsController: RequestHandler = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const metrics = await getOrderMetricsService(
      auth.restaurantId,
      req.query.from as string | undefined,
      req.query.to as string | undefined,
    );
    sendSuccess(res, metrics, 'Order metrics retrieved');
  } catch (error) {
    next(error);
  }
};

export const getTopSellingItemsController: RequestHandler = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const topSelling = await getTopSellingItemsService(
      auth.restaurantId,
      req.query.from as string | undefined,
      req.query.to as string | undefined,
      req.query.limit ? Number(req.query.limit) : undefined,
    );
    sendSuccess(res, topSelling, 'Top selling items retrieved');
  } catch (error) {
    next(error);
  }
};
