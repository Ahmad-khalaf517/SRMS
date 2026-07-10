import { ORDER_STATUS, ORDER_TYPE } from './constants';
import type { PaginationMeta } from '../http';

export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export type OrderFiltersDTO = {
  page: number;
  limit: number;
  search?: string;
  status?: OrderStatus;
  createdBy?: string;
  from?: string;
  to?: string;
};

export type TopSellingQueryDTO = {
  from?: string;
  to?: string;
  limit?: number;
};

export type OrderItem = {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  notes?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  restaurantId: string;
  createdBy: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
};

export type OrderList = {
  data: Order[];
  pagination: PaginationMeta;
};

export type OrderMetrics = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
};

export type TopSellingItem = {
  menuItemId: string;
  name: string;
  quantitySold: number;
  revenueContribution?: number;
};

export type OrderResponse = {
  success: true;
  message: string;
  data: Order;
};

export type OrderListResponse = {
  success: true;
  message: string;
  data: OrderList;
};

export type OrderMetricsResponse = {
  success: true;
  message: string;
  data: OrderMetrics;
};

export type TopSellingItemsResponse = {
  success: true;
  message: string;
  data: TopSellingItem[];
};
