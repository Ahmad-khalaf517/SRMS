import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemById,
  getMenuItems,
  toggleMenuItemAvailability,
  updateMenuItem,
} from '@srms/api-client';
import type {
  CreateMenuItemDTO,
  MenuItemFiltersQuery,
  ToggleMenuItemAvailabilityInput,
  UpdateMenuItemDTO,
} from '@srms/api-contracts/menu-item';

import { authApiClient } from '@/modules/auth/api/client';

export const getMenuItemsRequest = (params?: Partial<MenuItemFiltersQuery>) =>
  getMenuItems(authApiClient, params);

export const getMenuItemRequest = (id: string) => getMenuItemById(authApiClient, id);

export const createMenuItemRequest = (payload: CreateMenuItemDTO) =>
  createMenuItem(authApiClient, payload);

export const updateMenuItemRequest = (id: string, payload: UpdateMenuItemDTO) =>
  updateMenuItem(authApiClient, id, payload);

export const toggleMenuItemAvailabilityRequest = (
  id: string,
  payload: ToggleMenuItemAvailabilityInput,
) => toggleMenuItemAvailability(authApiClient, id, payload);

export const deleteMenuItemRequest = (id: string) => deleteMenuItem(authApiClient, id);
