export const OrderType = {
  DINE_IN: 'DINE_IN',
  TAKEAWAY: 'TAKEAWAY',
  DELIVERY: 'DELIVERY',
} as const;

export type OrderType = (typeof OrderType)[keyof typeof OrderType];
