import { type AxiosInstance } from 'axios';

import {
  ORDER_ENDPOINTS,
  type CreateOrderDTO,
  type OrderFiltersQuery,
  type OrderListResponse,
  type OrderMetricsQuery,
  type OrderMetricsResponse,
  type OrderResponse,
  type TopSellingItemsResponse,
  type TopSellingQuery,
  type UpdateOrderStatusDTO,
} from '@srms/api-contracts';

export const createOrder = async (
  client: AxiosInstance,
  payload: CreateOrderDTO,
): Promise<OrderResponse> => {
  const response = await client.post<OrderResponse>(ORDER_ENDPOINTS.BASE, payload);
  return response.data;
};

export const getOrders = async (
  client: AxiosInstance,
  params?: Partial<OrderFiltersQuery>,
): Promise<OrderListResponse> => {
  const response = await client.get<OrderListResponse>(ORDER_ENDPOINTS.BASE, { params });
  return response.data;
};

export const getMyOrders = async (
  client: AxiosInstance,
  params?: Partial<OrderFiltersQuery>,
): Promise<OrderListResponse> => {
  const response = await client.get<OrderListResponse>(ORDER_ENDPOINTS.MY, { params });
  return response.data;
};

export const getOrderById = async (client: AxiosInstance, id: string): Promise<OrderResponse> => {
  const response = await client.get<OrderResponse>(ORDER_ENDPOINTS.BY_ID(id));
  return response.data;
};

export const updateOrderStatus = async (
  client: AxiosInstance,
  id: string,
  payload: UpdateOrderStatusDTO,
): Promise<OrderResponse> => {
  const response = await client.patch<OrderResponse>(ORDER_ENDPOINTS.UPDATE_STATUS(id), payload);
  return response.data;
};

export const getOrderMetrics = async (
  client: AxiosInstance,
  params?: Partial<OrderMetricsQuery>,
): Promise<OrderMetricsResponse> => {
  const response = await client.get<OrderMetricsResponse>(ORDER_ENDPOINTS.METRICS, { params });
  return response.data;
};

export const getTopSellingItems = async (
  client: AxiosInstance,
  params?: Partial<TopSellingQuery>,
): Promise<TopSellingItemsResponse> => {
  const response = await client.get<TopSellingItemsResponse>(ORDER_ENDPOINTS.TOP_SELLING, {
    params,
  });
  return response.data;
};
