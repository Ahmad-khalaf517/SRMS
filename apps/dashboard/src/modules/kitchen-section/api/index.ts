import {
  getKitchenSections,
  createKitchenSection,
  updateKitchenSection,
  deleteKitchenSection,
} from '@srms/api-client';
import { authApiClient } from '@/modules/auth/api/client';
import type {
  KitchenSectionQuery,
  CreateKitchenSectionDTO,
  UpdateKitchenSectionDTO,
} from '@srms/api-contracts';

export const getKitchenSectionsRequest = (params?: Partial<KitchenSectionQuery>) =>
  getKitchenSections(authApiClient, params);

export const createKitchenSectionRequest = (payload: CreateKitchenSectionDTO) =>
  createKitchenSection(authApiClient, payload);

export const updateKitchenSectionRequest = (id: string, payload: UpdateKitchenSectionDTO) =>
  updateKitchenSection(authApiClient, id, payload);

export const deleteKitchenSectionRequest = (id: string) => deleteKitchenSection(authApiClient, id);
