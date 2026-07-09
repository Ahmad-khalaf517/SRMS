export type Category = {
  id: string;
  name: string;
  description?: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryDTO = {
  name: string;
  description?: string;
};

export type UpdateCategoryDTO = {
  name?: string;
  description?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
