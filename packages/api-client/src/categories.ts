import { type AxiosInstance } from 'axios';
import {
  CATEGORY_ENDPOINTS,
  type CategoryListResponse,
  type CategoryResponse,
  type CreateCategoryDTO,
  type UpdateCategoryDTO,
} from '@srms/api-contracts';
import { type CategoryQuery } from '@srms/api-contracts/categories';

export const getCategories = async (
  client: AxiosInstance,
  params?: Partial<CategoryQuery>,
): Promise<CategoryListResponse> => {
  const response = await client.get<CategoryListResponse>(CATEGORY_ENDPOINTS.BASE, { params });
  return response.data;
};

export const createCategory = async (
  client: AxiosInstance,
  payload: CreateCategoryDTO,
): Promise<CategoryResponse> => {
  const response = await client.post<CategoryResponse>(CATEGORY_ENDPOINTS.BASE, payload);
  return response.data;
};

export const updateCategory = async (
  client: AxiosInstance,
  id: string,
  payload: UpdateCategoryDTO,
): Promise<CategoryResponse> => {
  const response = await client.patch<CategoryResponse>(CATEGORY_ENDPOINTS.BY_ID(id), payload);
  return response.data;
};

export const deleteCategory = async (
  client: AxiosInstance,
  id: string,
): Promise<{ success: true; message: string; data: null }> => {
  const response = await client.delete(CATEGORY_ENDPOINTS.BY_ID(id));
  return response.data;
};
