import { createApiClient } from '@srms/api-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export const authApiClient = createApiClient({
  baseURL: API_BASE_URL,
});

export const setAuthAccessToken = (token: string | null) => {
  if (!token) {
    delete authApiClient.defaults.headers.common.Authorization;
    return;
  }

  authApiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};
