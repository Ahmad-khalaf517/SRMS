export const EXPENSE_ENDPOINTS = {
  BASE: '/expenses',
  BY_ID: (id: string) => `/expenses/${id}`,
} as const;
