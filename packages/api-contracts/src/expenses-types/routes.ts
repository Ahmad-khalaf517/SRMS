export const EXPENSES_TYPES_ENDPOINTS = {
  BASE: '/expenses-types',
  BY_ID: (id: string) => `/expenses-types/${id}`,
} as const;
