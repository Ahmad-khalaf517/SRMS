import {
  type User,
  type UserList,
  type CreateUserDTO,
  type UpdateUserDTO,
} from '@srms/api-contracts';
import {
  createUser as dbCreateUser,
  deleteUserById,
  findUserByRestaurant,
  findUserById,
  findUserByName,
  updateUserById,
} from '@/modules/user/repository/user.repository';
import { ConflictError, NotFoundError } from '@/shared/errors/app-error';
import type { UserDocument } from '@/modules/user/repository/user.repository';

const toDTO = (doc: UserDocument): User => ({
  id: doc._id.toString(),
  name: doc.name as string,
  email: doc.email as string,
  restaurantId: doc.restaurantId.toString(),
  createdAt: (doc.createdAt as Date).toISOString(),
  updatedAt: (doc.updatedAt as Date).toISOString(),
});

export const listUsers = async (
  restaurantId: string,
  page: number,
  limit: number,
): Promise<UserList> => {
  const { docs, total } = await findUserByRestaurant(restaurantId, page, limit);
  const totalPages = Math.ceil(total / limit);
  return {
    data: docs.map(toDTO),
    pagination: { page, limit, total, totalPages },
  };
};

export const createUserService = async (
  restaurantId: string,
  dto: CreateUserDTO,
): Promise<User> => {
  const trimmedName = dto.name.trim();
  const existing = await findUserByName(trimmedName, restaurantId);
  if (existing) {
    throw new ConflictError(`User "${trimmedName}" already exists in this restaurant`);
  }

  const doc = await dbCreateUser({
    name: trimmedName,
    email: dto.email?.trim(),
    password: dto.password,
    restaurantId,
  });
  return toDTO(doc);
};

export const updateUserService = async (
  restaurantId: string,
  id: string,
  dto: UpdateUserDTO,
): Promise<User> => {
  const existing = await findUserById(id, restaurantId);
  if (!existing) {
    throw new NotFoundError('User not found');
  }

  if (dto.name !== undefined) {
    const trimmedName = dto.name.trim();
    const duplicate = await findUserByName(trimmedName, restaurantId, id);
    if (duplicate) {
      throw new ConflictError(`User "${trimmedName}" already exists in this restaurant`);
    }
    dto = { ...dto, name: trimmedName };
  }

  const updated = await updateUserById(id, restaurantId, dto);
  if (!updated) {
    throw new NotFoundError('User not found');
  }
  return toDTO(updated);
};

export const deleteUserService = async (restaurantId: string, id: string): Promise<void> => {
  const deleted = await deleteUserById(id, restaurantId);
  if (!deleted) {
    throw new NotFoundError('User not found');
  }
};
