import type { QueryClient } from '@tanstack/react-query';
import { createApiClient, refreshAuth } from '@srms/api-client';
import { AUTH_ENDPOINTS, type AuthResponse } from '@srms/api-contracts/auth';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApiClient = createApiClient({
  baseURL: API_BASE_URL,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;
let responseInterceptorId: number | null = null;

export const setAuthAccessToken = (token: string | null) => {
  if (!token) {
    delete authApiClient.defaults.headers.common.Authorization;
    return;
  }

  authApiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const setupAuthInterceptors = (queryClient?: QueryClient) => {
  if (responseInterceptorId !== null) {
    authApiClient.interceptors.response.eject(responseInterceptorId);
  }

  responseInterceptorId = authApiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;
      const status = error.response?.status;
      const requestUrl = originalRequest?.url ?? '';
      const isRefreshRequest = requestUrl.includes(AUTH_ENDPOINTS.REFRESH);

      if (!originalRequest || status !== 401 || originalRequest._retry || isRefreshRequest) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAuth(authApiClient)
            .then((response: AuthResponse) => {
              const accessToken = response.data.accessToken;

              setAuthAccessToken(accessToken);
              useAuthSessionStore.getState().setSession({
                user: response.data.user,
                accessToken,
              });

              queryClient?.setQueryData(['auth', 'current-user'], response);

              return accessToken;
            })
            .catch((refreshError) => {
              setAuthAccessToken(null);
              useAuthSessionStore.getState().clearSession();
              void queryClient?.invalidateQueries({ queryKey: ['auth', 'current-user'] });
              throw refreshError;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return authApiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    },
  );
};
