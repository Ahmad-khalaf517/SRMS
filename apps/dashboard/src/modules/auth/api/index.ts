import { authApiClient } from '@/modules/auth/api/client';
import {
  login,
  getCurrentUser,
  logout,
  refreshAuth,
  registerRestaurantOwner,
} from '@srms/api-client';
import { type LoginDTO, type RegisterDTO } from '@srms/api-contracts/auth';

export const currentUserRequest = async () => getCurrentUser(authApiClient);
export const loginRequest = async (payload: LoginDTO) => login(authApiClient, payload);
export const logoutRequest = async () => logout(authApiClient);
export const refreshRequest = async () => refreshAuth(authApiClient);
export const registerRequest = async (payload: RegisterDTO) =>
  registerRestaurantOwner(authApiClient, payload);
