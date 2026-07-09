export const CATEGORY_ENDPOINTS = {
  BASE: '/categories',
  BY_ID: (id: string) => `/categories/${id}`,
} as const;
