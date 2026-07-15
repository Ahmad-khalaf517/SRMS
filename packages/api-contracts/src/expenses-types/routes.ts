export const Expenses_Types_ENDPOINTS = {
  BASE: '/expenses-types',
  BY_ID: (id: string) => `/expenses-types/${id}`,
} as const;
