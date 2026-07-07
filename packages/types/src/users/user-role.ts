export const UserRole = {
  ADMIN: 'ADMIN',
  CASHIER: 'CASHIER',
  KITCHEN_STAFF: 'KITCHEN_STAFF',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
