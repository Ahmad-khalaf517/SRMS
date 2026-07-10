import { getUser, createUser, updateUser, deleteUser } from '@srms/api-client';
import { authApiClient } from '@/modules/auth/api/client';
import type { UserQuery, CreateUserDTO, UpdateUserDTO } from '@srms/api-contracts';

export const getUserRequest = (params?: Partial<UserQuery>) => getUser(authApiClient, params);

export const createUserRequest = (payload: CreateUserDTO) => createUser(authApiClient, payload);

export const updateUserRequest = (id: string, payload: UpdateUserDTO) =>
  updateUser(authApiClient, id, payload);

export const deleteUserRequest = (id: string) => deleteUser(authApiClient, id);
