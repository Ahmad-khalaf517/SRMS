import axios, { type AxiosInstance } from 'axios';

type ApiClientConfig = {
  baseURL: string;
};

export const createApiClient = (config: ApiClientConfig): AxiosInstance => {
  return axios.create({
    baseURL: config.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
};

export * from './auth.js';
export * from './categories.js';
export * from './kitchen-section';
