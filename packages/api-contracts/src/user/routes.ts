export const USER_ENDPOINTS = {
  BASE: '/users',
  BY_ID: (id: string) => `/users/${id}`,
} as const;
