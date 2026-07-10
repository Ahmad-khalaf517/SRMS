import { type AxiosInstance } from 'axios';
import {
  MENU_ITEM_ENDPOINTS,
  type CreateMenuItemDTO,
  type MenuItemFiltersQuery,
  type MenuItemListResponse,
  type MenuItemResponse,
  type ToggleMenuItemAvailabilityDTO,
  type UpdateMenuItemDTO,
} from '@srms/api-contracts';

export const getMenuItems = async (
  client: AxiosInstance,
  params?: Partial<MenuItemFiltersQuery>,
): Promise<MenuItemListResponse> => {
  const response = await client.get<MenuItemListResponse>(MENU_ITEM_ENDPOINTS.BASE, { params });
  return response.data;
};

export const getMenuItemById = async (
  client: AxiosInstance,
  id: string,
): Promise<MenuItemResponse> => {
  const response = await client.get<MenuItemResponse>(MENU_ITEM_ENDPOINTS.BY_ID(id));
  return response.data;
};

export const createMenuItem = async (
  client: AxiosInstance,
  payload: CreateMenuItemDTO,
): Promise<MenuItemResponse> => {
  const response = await client.post<MenuItemResponse>(MENU_ITEM_ENDPOINTS.BASE, payload);
  return response.data;
};

export const updateMenuItem = async (
  client: AxiosInstance,
  id: string,
  payload: UpdateMenuItemDTO,
): Promise<MenuItemResponse> => {
  const response = await client.patch<MenuItemResponse>(MENU_ITEM_ENDPOINTS.BY_ID(id), payload);
  return response.data;
};

export const toggleMenuItemAvailability = async (
  client: AxiosInstance,
  id: string,
  payload: ToggleMenuItemAvailabilityDTO,
): Promise<MenuItemResponse> => {
  const response = await client.patch<MenuItemResponse>(
    MENU_ITEM_ENDPOINTS.TOGGLE_AVAILABILITY(id),
    payload,
  );
  return response.data;
};

export const deleteMenuItem = async (
  client: AxiosInstance,
  id: string,
): Promise<{ success: true; message: string; data: null }> => {
  const response = await client.delete(MENU_ITEM_ENDPOINTS.BY_ID(id));
  return response.data;
};
