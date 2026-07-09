export const KITCHEN_SECTION_ENDPOINTS = {
  BASE: '/kitchen-sections',
  BY_ID: (id: string) => `/kitchen-sections/${id}`,
} as const;
