import { type AxiosInstance } from 'axios';
import {
  KITCHEN_SECTION_ENDPOINTS,
  type KitchenSectionListResponse,
  type KitchenSectionResponse,
  type CreateKitchenSectionDTO,
  type UpdateKitchenSectionDTO,
} from '@srms/api-contracts';
import { type KitchenSectionQuery } from '@srms/api-contracts';

export const getKitchenSections = async (
  client: AxiosInstance,
  params?: Partial<KitchenSectionQuery>,
): Promise<KitchenSectionListResponse> => {
  const response = await client.get<KitchenSectionListResponse>(KITCHEN_SECTION_ENDPOINTS.BASE, {
    params,
  });
  return response.data;
};

export const createKitchenSection = async (
  client: AxiosInstance,
  payload: CreateKitchenSectionDTO,
): Promise<KitchenSectionResponse> => {
  const response = await client.post<KitchenSectionResponse>(
    KITCHEN_SECTION_ENDPOINTS.BASE,
    payload,
  );
  return response.data;
};

export const updateKitchenSection = async (
  client: AxiosInstance,
  id: string,
  payload: UpdateKitchenSectionDTO,
): Promise<KitchenSectionResponse> => {
  const response = await client.patch<KitchenSectionResponse>(
    KITCHEN_SECTION_ENDPOINTS.BY_ID(id),
    payload,
  );
  return response.data;
};

export const deleteKitchenSection = async (
  client: AxiosInstance,
  id: string,
): Promise<{ success: true; message: string; data: null }> => {
  const response = await client.delete(KITCHEN_SECTION_ENDPOINTS.BY_ID(id));
  return response.data;
};
