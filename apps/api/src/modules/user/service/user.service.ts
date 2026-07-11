import {
  type CreateUserDTO,
  type UpdateUserDTO,
  type User,
  type UserList,
  USER_ROLE,
} from '@srms/api-contracts';

import {
  countActiveAdmins,
  createUserWithRole,
  deleteUserIfOrphaned,
  deleteUserInRestaurant,
  findUserByEmailAddress,
  findUserByIdInRestaurant,
  listUsersByRestaurant,
  updateUserRecord,
  updateUserRole,
  updateUserRoleActive,
  type UserDocument,
  type UserRoleDocument,
} from '@/modules/user/repository/user.repository';
import { hashPassword } from '@/modules/auth/utils/password.util';
import { ConflictError, ForbiddenError, NotFoundError } from '@/shared/errors/app-error';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const toDTO = (user: UserDocument, role: UserRoleDocument): User => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  restaurantId: role.restaurantId.toString(),
  role: role.role,
  isActive: Boolean(user.isActive) && Boolean(role.isActive),
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

const ensureAdminFloor = async (restaurantId: string): Promise<void> => {
  const activeAdmins = await countActiveAdmins(restaurantId);
  if (activeAdmins <= 1) {
    throw new ConflictError('At least one active admin must remain in the restaurant');
  }
};

export const listUsers = async (
  restaurantId: string,
  currentUserId: string,
  page: number,
  limit: number,
): Promise<UserList> => {
  const { docs, total } = await listUsersByRestaurant(restaurantId, page, limit, currentUserId);
  const totalPages = Math.ceil(total / limit);

  return {
    data: docs.map(({ user, role }) => toDTO(user, role)),
    pagination: { page, limit, total, totalPages },
  };
};

export const createUserService = async (
  restaurantId: string,
  dto: CreateUserDTO,
): Promise<User> => {
  const name = dto.name.trim();
  const email = normalizeEmail(dto.email);

  const existingByEmail = await findUserByEmailAddress(email);
  if (existingByEmail) {
    throw new ConflictError('User email already exists');
  }

  const hashedPassword = await hashPassword(dto.password);
  const role = dto.role ?? USER_ROLE.CASHIER;
  const isActive = dto.isActive ?? true;

  const { user, role: roleDoc } = await createUserWithRole(
    restaurantId,
    {
      name,
      email,
      password: hashedPassword,
      role,
      isActive,
    },
    role,
  );

  if (!isActive) {
    await updateUserRoleActive(user._id.toString(), restaurantId, false);
  }

  const finalRole = await findUserByIdInRestaurant(user._id.toString(), restaurantId);
  if (!finalRole) {
    return toDTO(user, roleDoc);
  }

  return toDTO(finalRole.user, finalRole.role);
};

export const updateUserService = async (
  restaurantId: string,
  actingUserId: string,
  id: string,
  dto: UpdateUserDTO,
): Promise<User> => {
  const existing = await findUserByIdInRestaurant(id, restaurantId);
  if (!existing) {
    throw new NotFoundError('User not found');
  }

  if (id === actingUserId && dto.isActive === false) {
    throw new ForbiddenError('You cannot deactivate your own account');
  }

  const isAdminDemotion =
    existing.role.role === USER_ROLE.ADMIN &&
    dto.role !== undefined &&
    dto.role !== USER_ROLE.ADMIN;
  const isAdminDeactivation =
    existing.role.role === USER_ROLE.ADMIN && existing.role.isActive && dto.isActive === false;

  if (isAdminDemotion || isAdminDeactivation) {
    await ensureAdminFloor(restaurantId);
  }

  const userUpdates: Partial<Pick<UserDocument, 'name' | 'email' | 'password' | 'isActive'>> = {};

  if (dto.name !== undefined) {
    userUpdates.name = dto.name.trim();
  }

  if (dto.email !== undefined) {
    const email = normalizeEmail(dto.email);
    const duplicate = await findUserByEmailAddress(email);
    if (duplicate && duplicate._id.toString() !== id) {
      throw new ConflictError('User email already exists');
    }
    userUpdates.email = email;
  }

  if (dto.password !== undefined) {
    userUpdates.password = await hashPassword(dto.password);
  }

  if (dto.isActive !== undefined) {
    userUpdates.isActive = dto.isActive;
  }

  if (Object.keys(userUpdates).length > 0) {
    await updateUserRecord(id, userUpdates);
  }

  if (dto.role !== undefined) {
    await updateUserRole(id, restaurantId, dto.role);
  }

  if (dto.isActive !== undefined) {
    await updateUserRoleActive(id, restaurantId, dto.isActive);
  }

  const updated = await findUserByIdInRestaurant(id, restaurantId);
  if (!updated) {
    throw new NotFoundError('User not found');
  }

  return toDTO(updated.user, updated.role);
};

export const deleteUserService = async (
  restaurantId: string,
  actingUserId: string,
  id: string,
): Promise<void> => {
  if (id === actingUserId) {
    throw new ForbiddenError('You cannot delete your own account');
  }

  const existing = await findUserByIdInRestaurant(id, restaurantId);
  if (!existing) {
    throw new NotFoundError('User not found');
  }

  if (existing.role.role === USER_ROLE.ADMIN && existing.role.isActive) {
    await ensureAdminFloor(restaurantId);
  }

  const deletedRoles = await deleteUserInRestaurant(id, restaurantId);
  if (deletedRoles === 0) {
    throw new NotFoundError('User not found');
  }

  await deleteUserIfOrphaned(id);
};
