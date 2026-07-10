import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrderMetrics,
  getOrders,
  getTopSellingItems,
  updateOrderStatus,
} from '@srms/api-client';
import type {
  CreateOrderDTO,
  OrderFiltersQuery,
  OrderMetricsQuery,
  TopSellingQuery,
  UpdateOrderStatusDTO,
} from '@srms/api-contracts/orders';

import { authApiClient } from '@/modules/auth/api/client';

export const createOrderRequest = (payload: CreateOrderDTO) => createOrder(authApiClient, payload);

export const getOrdersRequest = (params?: Partial<OrderFiltersQuery>) =>
  getOrders(authApiClient, params);

export const getMyOrdersRequest = (params?: Partial<OrderFiltersQuery>) =>
  getMyOrders(authApiClient, params);

export const getOrderRequest = (id: string) => getOrderById(authApiClient, id);

export const updateOrderStatusRequest = (id: string, payload: UpdateOrderStatusDTO) =>
  updateOrderStatus(authApiClient, id, payload);

export const getOrderMetricsRequest = (params?: Partial<OrderMetricsQuery>) =>
  getOrderMetrics(authApiClient, params);

export const getTopSellingItemsRequest = (params?: Partial<TopSellingQuery>) =>
  getTopSellingItems(authApiClient, params);
