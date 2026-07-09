import { type AxiosInstance } from 'axios';
import {
  USER_ENDPOINTS,
  type UserQuery,
  type UserListResponse,
  type UserResponse,
  type CreateUserDTO,
  type UpdateUserDTO,
} from '@srms/api-contracts';

export const getUser = async (
  client: AxiosInstance,
  params?: Partial<UserQuery>,
): Promise<UserListResponse> => {
  const response = await client.get<UserListResponse>(USER_ENDPOINTS.BASE, { params });
  return response.data;
};

export const createUser = async (
  client: AxiosInstance,
  payload: CreateUserDTO,
): Promise<UserResponse> => {
  const response = await client.post<UserResponse>(USER_ENDPOINTS.BASE, payload);
  return response.data;
};

export const updateUser = async (
  client: AxiosInstance,
  id: string,
  payload: UpdateUserDTO,
): Promise<UserResponse> => {
  const response = await client.patch<UserResponse>(USER_ENDPOINTS.BY_ID(id), payload);
  return response.data;
};

export const deleteUser = async (
  client: AxiosInstance,
  id: string,
): Promise<{ success: true; message: string; data: null }> => {
  const response = await client.delete(USER_ENDPOINTS.BY_ID(id));
  return response.data;
};
