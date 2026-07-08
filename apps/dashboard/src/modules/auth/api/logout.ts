import { authApiClient } from '@/modules/auth/api/client';

export const logoutRequest = async () => {
  const response = await authApiClient.post('/auth/logout');
  return response.data;
};
