import {
  AUTH_ENDPOINTS,
  AuthResponse,
  LoginDTO,
  LoginResponse,
  RegisterDTO,
  RegisterResponse,
} from '@srms/api-contracts';
import { type AxiosInstance } from 'axios';

export const registerRestaurantOwner = async (
  client: AxiosInstance,
  payload: RegisterDTO,
): Promise<RegisterResponse> => {
  const response = await client.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER, payload);
  return response.data;
};

export const login = async (client: AxiosInstance, payload: LoginDTO): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, payload);
  return response.data;
};

export const getCurrentUser = async (client: AxiosInstance): Promise<AuthResponse> => {
  const response = await client.get<AuthResponse>(AUTH_ENDPOINTS.CURRENT_USER);
  return response.data;
};

export const refreshAuth = async (client: AxiosInstance): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH);
  return response.data;
};

export const logout = async (client: AxiosInstance): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>(AUTH_ENDPOINTS.LOGOUT);
  return response.data;
};
