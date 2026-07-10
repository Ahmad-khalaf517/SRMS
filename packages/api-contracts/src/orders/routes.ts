export const ORDER_ENDPOINTS = {
  BASE: '/orders',
  BY_ID: (id: string) => `/orders/${id}`,
  MY: '/orders/my',
  UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  METRICS: '/orders/metrics',
  TOP_SELLING: '/orders/top-selling',
} as const;
