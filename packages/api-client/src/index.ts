import axios, { type AxiosInstance } from 'axios';

export type ApiClientConfig = {
  baseURL: string;
  timeoutMs?: number;
};

export const createApiClient = (config: ApiClientConfig): AxiosInstance => {
  return axios.create({
    baseURL: config.baseURL,
    timeout: config.timeoutMs ?? 10000,
    withCredentials: true,
  });
};
