import {
  type CreateMenuItemDTO,
  type MenuItem,
  type MenuItemFiltersQuery,
  type MenuItemList,
  type MenuItemListItem,
  type UpdateMenuItemDTO,
} from '@srms/api-contracts';
import {
  createMenuItem as dbCreateMenuItem,
  deleteMenuItemById,
  findMenuItemById,
  findMenuItemsByRestaurant,
  toggleMenuItemAvailability,
  updateMenuItemById,
  type MenuItemDocument,
} from '@/modules/menu-item/repository/menu-item.repository';
import { findCategoryById } from '@/modules/categories/repository/category.repository';
import { findKitchenSectionById } from '@/modules/kitchen-section/repository/kitchen-section.repository';
import { NotFoundError } from '@/shared/errors/app-error';

const toDTO = (doc: MenuItemDocument): MenuItem => ({
  id: doc._id.toString(),
  name: doc.name as string,
  description: doc.description as string | undefined,
  price: doc.price as number,
  categoryId: doc.categoryId.toString(),
  kitchenSectionId: doc.kitchenSectionId.toString(),
  restaurantId: doc.restaurantId.toString(),
  isAvailable: doc.isAvailable as boolean,
  createdAt: (doc.createdAt as Date).toISOString(),
  updatedAt: (doc.updatedAt as Date).toISOString(),
});

const toListItemDTO = async (
  restaurantId: string,
  doc: MenuItemDocument,
): Promise<MenuItemListItem> => {
  const [category, kitchenSection] = await Promise.all([
    findCategoryById(doc.categoryId.toString(), restaurantId),
    findKitchenSectionById(doc.kitchenSectionId.toString(), restaurantId),
  ]);

  return {
    id: doc._id.toString(),
    name: doc.name as string,
    price: doc.price as number,
    categoryId: doc.categoryId.toString(),
    categoryName: (category?.name as string | undefined) ?? 'Unknown category',
    kitchenSectionId: doc.kitchenSectionId.toString(),
    kitchenSectionName: (kitchenSection?.name as string | undefined) ?? 'Unknown kitchen section',
    isAvailable: doc.isAvailable as boolean,
    createdAt: (doc.createdAt as Date).toISOString(),
  };
};

const ensureValidRelations = async (
  restaurantId: string,
  categoryId?: string,
  kitchenSectionId?: string,
) => {
  if (categoryId) {
    const category = await findCategoryById(categoryId, restaurantId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
  }

  if (kitchenSectionId) {
    const kitchenSection = await findKitchenSectionById(kitchenSectionId, restaurantId);
    if (!kitchenSection) {
      throw new NotFoundError('Kitchen section not found');
    }
  }
};

export const listMenuItems = async (
  restaurantId: string,
  filters: Partial<MenuItemFiltersQuery>,
): Promise<MenuItemList> => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const { docs, total } = await findMenuItemsByRestaurant(restaurantId, filters);
  const totalPages = Math.ceil(total / limit);
  const data = await Promise.all(docs.map((doc) => toListItemDTO(restaurantId, doc)));

  return {
    data,
    pagination: { page, limit, total, totalPages },
  };
};

export const getMenuItem = async (restaurantId: string, id: string): Promise<MenuItem> => {
  const doc = await findMenuItemById(id, restaurantId);
  if (!doc) {
    throw new NotFoundError('Menu item not found');
  }

  return toDTO(doc);
};

export const createMenuItemService = async (
  restaurantId: string,
  dto: CreateMenuItemDTO,
): Promise<MenuItem> => {
  await ensureValidRelations(restaurantId, dto.categoryId, dto.kitchenSectionId);

  const doc = await dbCreateMenuItem({
    ...dto,
    name: dto.name.trim(),
    description: dto.description?.trim(),
    restaurantId,
    isAvailable: dto.isAvailable ?? true,
  });

  return toDTO(doc);
};

export const updateMenuItemService = async (
  restaurantId: string,
  id: string,
  dto: UpdateMenuItemDTO,
): Promise<MenuItem> => {
  const existing = await findMenuItemById(id, restaurantId);
  if (!existing) {
    throw new NotFoundError('Menu item not found');
  }

  await ensureValidRelations(restaurantId, dto.categoryId, dto.kitchenSectionId);

  const payload: UpdateMenuItemDTO = {
    ...dto,
    name: dto.name?.trim(),
    description: dto.description?.trim(),
  };

  const updated = await updateMenuItemById(id, restaurantId, payload);
  if (!updated) {
    throw new NotFoundError('Menu item not found');
  }

  return toDTO(updated);
};

export const toggleMenuItemAvailabilityService = async (
  restaurantId: string,
  id: string,
  isAvailable: boolean,
): Promise<MenuItem> => {
  const updated = await toggleMenuItemAvailability(id, restaurantId, isAvailable);
  if (!updated) {
    throw new NotFoundError('Menu item not found');
  }

  return toDTO(updated);
};

export const deleteMenuItemService = async (restaurantId: string, id: string): Promise<void> => {
  const deleted = await deleteMenuItemById(id, restaurantId);
  if (!deleted) {
    throw new NotFoundError('Menu item not found');
  }
};
