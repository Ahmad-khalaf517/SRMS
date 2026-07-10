export const MENU_ITEM_ENDPOINTS = {
  BASE: '/menu-items',
  BY_ID: (id: string) => `/menu-items/${id}`,
  TOGGLE_AVAILABILITY: (id: string) => `/menu-items/${id}/availability`,
} as const;
