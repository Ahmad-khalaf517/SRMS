export const PaymentMethod = {
  CASH: 'CASH',
  CARD: 'CARD',
  ONLINE: 'ONLINE',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
