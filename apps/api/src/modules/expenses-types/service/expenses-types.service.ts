import {
  type ExpensesTypes,
  type ExpensesTypesList,
  type CreateExpensesTypesDTO,
  type UpdateExpensesTypesDTO,
} from '@srms/api-contracts';
import {
  createExpensesTypes as dbCreateExpensesTypes,
  deleteExpensesTypesById,
  findExpensesTypesByRestaurant,
  findExpensesTypesById,
  findExpensesTypesByName,
  updateExpensesTypesById,
} from '@/modules/expenses-types/repository/expenses-types.repository';
import { ConflictError, NotFoundError } from '@/shared/errors/app-error';
import type { ExpensesTypesDocument } from '@/modules/expenses-types/repository/expenses-types.repository';

const toDTO = (doc: ExpensesTypesDocument): ExpensesTypes => ({
  id: doc._id.toString(),
  isActive: doc.isActive,
  name: doc.name as string,
  code: doc.code as string,
  color: doc.color as string,
  icon: doc.icon as string,
  description: doc.description as string | undefined,
  restaurantId: doc.restaurantId.toString(),
  createdAt: (doc.createdAt as Date).toISOString(),
  updatedAt: (doc.updatedAt as Date).toISOString(),
});

export const listExpensesTypes = async (
  restaurantId: string,
  page: number,
  limit: number,
): Promise<ExpensesTypesList> => {
  const { docs, total } = await findExpensesTypesByRestaurant(restaurantId, page, limit);
  const totalPages = Math.ceil(total / limit);
  return {
    data: docs.map(toDTO),
    pagination: { page, limit, total, totalPages },
  };
};

export const createExpensesTypesService = async (
  restaurantId: string,
  dto: CreateExpensesTypesDTO,
): Promise<ExpensesTypes> => {
  const trimmedName = dto.name.trim();
  const existing = await findExpensesTypesByName(trimmedName, restaurantId);
  if (existing) {
    throw new ConflictError(`Expenses Type "${trimmedName}" already exists in this restaurant`);
  }

  const doc = await dbCreateExpensesTypes({
    name: trimmedName,
    isActive: dto.isActive,
    code: dto.code?.trim(),
    color: dto.color?.trim(),
    icon: dto.icon?.trim(),
    description: dto.description?.trim(),
    restaurantId,
  });
  return toDTO(doc);
};

export const updateExpensesTypesService = async (
  restaurantId: string,
  id: string,
  dto: UpdateExpensesTypesDTO,
): Promise<ExpensesTypes> => {
  const existing = await findExpensesTypesById(id, restaurantId);
  if (!existing) {
    throw new NotFoundError('Expenses Type not found');
  }

  if (dto.name !== undefined) {
    const trimmedName = dto.name.trim();
    const duplicate = await findExpensesTypesByName(trimmedName, restaurantId, id);
    if (duplicate) {
      throw new ConflictError(`Expenses Type "${trimmedName}" already exists in this restaurant`);
    }
    dto = { ...dto, name: trimmedName };
  }

  if (dto.description !== undefined) {
    dto = { ...dto, description: dto.description.trim() };
  }

  const updated = await updateExpensesTypesById(id, restaurantId, dto);
  if (!updated) {
    throw new NotFoundError('Expenses Type not found');
  }
  return toDTO(updated);
};

export const deleteExpensesTypesService = async (
  restaurantId: string,
  id: string,
): Promise<void> => {
  const deleted = await deleteExpensesTypesById(id, restaurantId);
  if (!deleted) {
    throw new NotFoundError('Expenses Type not found');
  }
};
