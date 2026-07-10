import { PaginationMeta } from '../http';

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  kitchenSectionId: string;
  restaurantId: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MenuItemListItem = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  categoryName: string;
  kitchenSectionId: string;
  kitchenSectionName: string;
  isAvailable: boolean;
  createdAt: string;
};

export type MenuItemFiltersDTO = {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  kitchenSectionId?: string;
  isAvailable?: boolean;
};

export type MenuItemList = {
  data: MenuItemListItem[];
  pagination: PaginationMeta;
};

export type MenuItemResponse = {
  success: true;
  message: string;
  data: MenuItem;
};

export type MenuItemListResponse = {
  success: true;
  message: string;
  data: MenuItemList;
};
