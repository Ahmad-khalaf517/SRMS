export const UserRole = {
  ADMIN: 'ADMIN',
  CASHIER: 'CASHIER',
  KITCHEN: 'KITCHEN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
