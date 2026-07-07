import { login } from '@srms/api-client';
import { type LoginRequest } from '@srms/types/auth/login';

import { authApiClient } from '@/modules/auth/api/client';

export const loginRequest = async (payload: LoginRequest) => {
  return login(authApiClient, payload);
};
