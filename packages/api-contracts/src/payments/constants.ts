export const PAYMENT_METHOD = {
  CASH: 'CASH',
  CARD: 'CARD',
  ONLINE: 'ONLINE',
} as const;

export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
} as const;
