export const USER_ENDPOINTS = {
  BASE: '/user',
  BY_ID: (id: string) => `/user/${id}`,
} as const;
