import {
  type KitchenSection,
  type KitchenSectionList,
  type CreateKitchenSectionDTO,
  type UpdateKitchenSectionDTO,
} from '@srms/api-contracts';
import {
  createKitchenSection as dbCreateKitchenSection,
  deleteKitchenSectionById,
  findKitchenSectionsByRestaurant,
  findKitchenSectionById,
  findKitchenSectionByName,
  updateKitchenSectionById,
} from '@/modules/kitchen-section/repository/kitchen-section.repository';
import { ConflictError, NotFoundError } from '@/shared/errors/app-error';
import type { KitchenSectionDocument } from '@/modules/kitchen-section/repository/kitchen-section.repository';

const toDTO = (doc: KitchenSectionDocument): KitchenSection => ({
  id: doc._id.toString(),
  name: doc.name as string,
  description: doc.description as string | undefined,
  isActive: doc.isActive as boolean,
  restaurantId: doc.restaurantId.toString(),
  createdAt: (doc.createdAt as Date).toISOString(),
  updatedAt: (doc.updatedAt as Date).toISOString(),
});

export const listKitchenSections = async (
  restaurantId: string,
  page: number,
  limit: number,
): Promise<KitchenSectionList> => {
  const { docs, total } = await findKitchenSectionsByRestaurant(restaurantId, page, limit);
  const totalPages = Math.ceil(total / limit);
  return {
    data: docs.map(toDTO),
    pagination: { page, limit, total, totalPages },
  };
};

export const createKitchenSectionService = async (
  restaurantId: string,
  dto: CreateKitchenSectionDTO,
): Promise<KitchenSection> => {
  const trimmedName = dto.name.trim();
  const existing = await findKitchenSectionByName(trimmedName, restaurantId);
  if (existing) {
    throw new ConflictError(`Kitchen section "${trimmedName}" already exists in this restaurant`);
  }

  const doc = await dbCreateKitchenSection({
    name: trimmedName,
    description: dto.description?.trim(),
    isActive: dto.isActive ?? true,
    restaurantId,
  });
  return toDTO(doc);
};

export const updateKitchenSectionService = async (
  restaurantId: string,
  id: string,
  dto: UpdateKitchenSectionDTO,
): Promise<KitchenSection> => {
  const existing = await findKitchenSectionById(id, restaurantId);
  if (!existing) {
    throw new NotFoundError('Kitchen section not found');
  }

  if (dto.name !== undefined) {
    const trimmedName = dto.name.trim();
    const duplicate = await findKitchenSectionByName(trimmedName, restaurantId, id);
    if (duplicate) {
      throw new ConflictError(`Kitchen section "${trimmedName}" already exists in this restaurant`);
    }
    dto = { ...dto, name: trimmedName };
  }

  if (dto.description !== undefined) {
    dto = { ...dto, description: dto.description.trim() };
  }

  const updated = await updateKitchenSectionById(id, restaurantId, dto);
  if (!updated) {
    throw new NotFoundError('Kitchen section not found');
  }
  return toDTO(updated);
};

export const deleteKitchenSectionService = async (
  restaurantId: string,
  id: string,
): Promise<void> => {
  const deleted = await deleteKitchenSectionById(id, restaurantId);
  if (!deleted) {
    throw new NotFoundError('Kitchen section not found');
  }
};
