import { getExpenses, createExpenses, updateExpenses, deleteExpenses } from '@srms/api-client';
import { authApiClient } from '@/modules/auth/api/client';
import type { ExpensesQuery, CreateExpensesDTO, UpdateExpensesDTO } from '@srms/api-contracts';

export const getExpensesRequest = (params?: Partial<ExpensesQuery>) =>
  getExpenses(authApiClient, params);

export const createExpensesRequest = (payload: CreateExpensesDTO) =>
  createExpenses(authApiClient, payload);

export const updateExpensesRequest = (id: string, payload: UpdateExpensesDTO) =>
  updateExpenses(authApiClient, id, payload);

export const deleteExpensesRequest = (id: string) => deleteExpenses(authApiClient, id);
