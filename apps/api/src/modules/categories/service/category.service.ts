import {
  type Category,
  type CategoryList,
  type CreateCategoryDTO,
  type UpdateCategoryDTO,
} from '@srms/api-contracts';
import {
  createCategory as dbCreateCategory,
  deleteCategoryById,
  findCategoriesByRestaurant,
  findCategoryById,
  findCategoryByName,
  updateCategoryById,
} from '@/modules/categories/repository/category.repository';
import { ConflictError, NotFoundError } from '@/shared/errors/app-error';
import type { CategoryDocument } from '@/modules/categories/repository/category.repository';

const toDTO = (doc: CategoryDocument): Category => ({
  id: doc._id.toString(),
  name: doc.name as string,
  description: doc.description as string | undefined,
  restaurantId: doc.restaurantId.toString(),
  createdAt: (doc.createdAt as Date).toISOString(),
  updatedAt: (doc.updatedAt as Date).toISOString(),
});

export const listCategories = async (
  restaurantId: string,
  page: number,
  limit: number,
): Promise<CategoryList> => {
  const { docs, total } = await findCategoriesByRestaurant(restaurantId, page, limit);
  const totalPages = Math.ceil(total / limit);
  return {
    data: docs.map(toDTO),
    pagination: { page, limit, total, totalPages },
  };
};

export const createCategoryService = async (
  restaurantId: string,
  dto: CreateCategoryDTO,
): Promise<Category> => {
  const trimmedName = dto.name.trim();
  const existing = await findCategoryByName(trimmedName, restaurantId);
  if (existing) {
    throw new ConflictError(`Category "${trimmedName}" already exists in this restaurant`);
  }

  const doc = await dbCreateCategory({
    name: trimmedName,
    description: dto.description?.trim(),
    restaurantId,
  });
  return toDTO(doc);
};

export const updateCategoryService = async (
  restaurantId: string,
  id: string,
  dto: UpdateCategoryDTO,
): Promise<Category> => {
  const existing = await findCategoryById(id, restaurantId);
  if (!existing) {
    throw new NotFoundError('Category not found');
  }

  if (dto.name !== undefined) {
    const trimmedName = dto.name.trim();
    const duplicate = await findCategoryByName(trimmedName, restaurantId, id);
    if (duplicate) {
      throw new ConflictError(`Category "${trimmedName}" already exists in this restaurant`);
    }
    dto = { ...dto, name: trimmedName };
  }

  if (dto.description !== undefined) {
    dto = { ...dto, description: dto.description.trim() };
  }

  const updated = await updateCategoryById(id, restaurantId, dto);
  if (!updated) {
    throw new NotFoundError('Category not found');
  }
  return toDTO(updated);
};

export const deleteCategoryService = async (restaurantId: string, id: string): Promise<void> => {
  const deleted = await deleteCategoryById(id, restaurantId);
  if (!deleted) {
    throw new NotFoundError('Category not found');
  }
};
