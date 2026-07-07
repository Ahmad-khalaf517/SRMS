import { type AuthResponse } from '@srms/types/auth';

import { authApiClient } from '@/modules/auth/api/client';

export const refreshRequest = async () => {
  const response = await authApiClient.post<AuthResponse>('/auth/refresh');
  return response.data;
};
