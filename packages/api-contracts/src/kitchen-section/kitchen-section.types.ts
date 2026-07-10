import { PaginationMeta } from '../http';

export type KitchenSection = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
};

export type KitchenSectionList = {
  data: KitchenSection[];
  pagination: PaginationMeta;
};

export type KitchenSectionResponse = {
  success: true;
  message: string;
  data: KitchenSection;
};

export type KitchenSectionListResponse = {
  success: true;
  message: string;
  data: KitchenSectionList;
};
