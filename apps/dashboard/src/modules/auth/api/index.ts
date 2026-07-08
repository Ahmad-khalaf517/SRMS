import { authApiClient } from '@/modules/auth/api/client';
import {
  login,
  getCurrentUser,
  logout,
  refreshAuth,
  registerRestaurantOwner,
} from '@srms/api-client';
import { type LoginRequest } from '@srms/types/auth/login';
import { type RegisterRequest } from '@srms/types/auth/register';

export const currentUserRequest = async () => getCurrentUser(authApiClient);
export const loginRequest = async (payload: LoginRequest) => login(authApiClient, payload);
export const logoutRequest = async () => logout(authApiClient);
export const refreshRequest = async () => refreshAuth(authApiClient);
export const registerRequest = async (payload: RegisterRequest) =>
  registerRestaurantOwner(authApiClient, payload);
