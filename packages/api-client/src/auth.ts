import { type AxiosInstance } from 'axios';
import { type LoginRequest, type LoginResponse } from '@srms/types/auth/login';
import { type RegisterRequest, type RegisterResponse } from '@srms/types/auth/register';
import { type AuthResponse } from '@srms/types/auth';

export const registerRestaurantOwner = async (
  client: AxiosInstance,
  payload: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await client.post<RegisterResponse>('/auth/register', payload);
  return response.data;
};

export const login = async (
  client: AxiosInstance,
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>('/auth/login', payload);
  return response.data;
};

export const getCurrentUser = async (client: AxiosInstance): Promise<AuthResponse> => {
  const response = await client.get<AuthResponse>('/auth/me');
  return response.data;
};
