import { getCategories, createCategory, updateCategory, deleteCategory } from '@srms/api-client';
import { authApiClient } from '@/modules/auth/api/client';
import type { CategoryQuery, CreateCategoryDTO, UpdateCategoryDTO } from '@srms/api-contracts';

export const getCategoriesRequest = (params?: Partial<CategoryQuery>) =>
  getCategories(authApiClient, params);

export const createCategoryRequest = (payload: CreateCategoryDTO) =>
  createCategory(authApiClient, payload);

export const updateCategoryRequest = (id: string, payload: UpdateCategoryDTO) =>
  updateCategory(authApiClient, id, payload);

export const deleteCategoryRequest = (id: string) => deleteCategory(authApiClient, id);
