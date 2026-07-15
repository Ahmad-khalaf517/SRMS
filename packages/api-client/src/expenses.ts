import { type AxiosInstance } from 'axios';
import {
  EXPENSE_ENDPOINTS,
  type ExpensesListResponse,
  type ExpensesResponse,
  type CreateExpensesDTO,
  type UpdateExpensesDTO,
  type ExpensesQuery,
} from '@srms/api-contracts';

export const getExpenses = async (
  client: AxiosInstance,
  params?: Partial<ExpensesQuery>,
): Promise<ExpensesListResponse> => {
  const response = await client.get<ExpensesListResponse>(EXPENSE_ENDPOINTS.BASE, {
    params,
  });
  return response.data;
};

export const createExpenses = async (
  client: AxiosInstance,
  payload: CreateExpensesDTO,
): Promise<ExpensesResponse> => {
  const response = await client.post<ExpensesResponse>(EXPENSE_ENDPOINTS.BASE, payload);
  return response.data;
};

export const updateExpenses = async (
  client: AxiosInstance,
  id: string,
  payload: UpdateExpensesDTO,
): Promise<ExpensesResponse> => {
  const response = await client.patch<ExpensesResponse>(EXPENSE_ENDPOINTS.BY_ID(id), payload);
  return response.data;
};

export const deleteExpenses = async (
  client: AxiosInstance,
  id: string,
): Promise<{ success: true; message: string; data: null }> => {
  const response = await client.delete(EXPENSE_ENDPOINTS.BY_ID(id));
  return response.data;
};
