import { type AxiosInstance } from 'axios';
import {
  EXPENSES_TYPES_ENDPOINTS,
  type ExpensesTypesListResponse,
  type ExpensesTypesResponse,
  type ExpensesTypesQuery,
  type CreateExpensesTypesDTO,
  type UpdateExpensesTypesDTO,
} from '@srms/api-contracts';

export const getExpensesTypes = async (
  client: AxiosInstance,
  params?: Partial<ExpensesTypesQuery>,
): Promise<ExpensesTypesListResponse> => {
  const response = await client.get<ExpensesTypesListResponse>(EXPENSES_TYPES_ENDPOINTS.BASE, {
    params,
  });
  return response.data;
};

export const createExpensesTypes = async (
  client: AxiosInstance,
  payload: CreateExpensesTypesDTO,
): Promise<ExpensesTypesResponse> => {
  const response = await client.post<ExpensesTypesResponse>(EXPENSES_TYPES_ENDPOINTS.BASE, payload);
  return response.data;
};

export const updateExpensesTypes = async (
  client: AxiosInstance,
  id: string,
  payload: UpdateExpensesTypesDTO,
): Promise<ExpensesTypesResponse> => {
  const response = await client.patch<ExpensesTypesResponse>(
    EXPENSES_TYPES_ENDPOINTS.BY_ID(id),
    payload,
  );
  return response.data;
};

export const deleteExpensesTypes = async (
  client: AxiosInstance,
  id: string,
): Promise<{ success: true; message: string; data: null }> => {
  const response = await client.delete(EXPENSES_TYPES_ENDPOINTS.BY_ID(id));
  return response.data;
};
