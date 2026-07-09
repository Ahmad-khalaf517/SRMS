import { PaginationMeta } from '../http';

export type Category = {
  id: string;
  name: string;
  description?: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryList = {
  data: Category[];
  pagination: PaginationMeta;
};

export type CategoryResponse = {
  success: true;
  message: string;
  data: Category;
};

export type CategoryListResponse = {
  success: true;
  message: string;
  data: CategoryList;
};
