import {
  getExpensesTypes,
  createExpensesTypes,
  updateExpensesTypes,
  deleteExpensesTypes,
} from '@srms/api-client';
import { authApiClient } from '@/modules/auth/api/client';
import type {
  ExpensesTypesQuery,
  CreateExpensesTypesDTO,
  UpdateExpensesTypesDTO,
} from '@srms/api-contracts';
export const getExpensesTypesRequest = (params?: Partial<ExpensesTypesQuery>) =>
  getExpensesTypes(authApiClient, params);

export const createExpensesTypesRequest = (payload: CreateExpensesTypesDTO) =>
  createExpensesTypes(authApiClient, payload);

export const updateExpensesTypesRequest = (id: string, payload: UpdateExpensesTypesDTO) =>
  updateExpensesTypes(authApiClient, id, payload);

export const deleteExpensesTypesRequest = (id: string) => deleteExpensesTypes(authApiClient, id);
