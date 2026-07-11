import type { CreateUserDTO, UserRole } from '@srms/api-contracts';

import {
  createUser as createAuthUser,
  deleteUserById as deleteAuthUserById,
  findUserByEmail,
  findUserById,
  findUsersByIds,
  type UserDocument,
  updateUserById,
} from '@/modules/auth/repository/user.repository';
import {
  countActiveAdminsByRestaurant,
  countRolesForUser,
  createUserRole,
  deleteRolesForUserInRestaurant,
  findRoleForUserInRestaurant,
  findRolesByRestaurant,
  updateRoleActiveForUserInRestaurant,
  updateRoleForUserInRestaurant,
  type UserRoleDocument,
} from '@/modules/auth/repository/user-role.repository';

export { type UserDocument, type UserRoleDocument };

export const findUserByEmailAddress = async (email: string): Promise<UserDocument | null> => {
  return findUserByEmail(email);
};

export const findUserByIdInRestaurant = async (
  userId: string,
  restaurantId: string,
): Promise<{ user: UserDocument; role: UserRoleDocument } | null> => {
  const [user, role] = await Promise.all([
    findUserById(userId),
    findRoleForUserInRestaurant(userId, restaurantId),
  ]);

  if (!user || !role) {
    return null;
  }

  return { user, role };
};

export const listUsersByRestaurant = async (
  restaurantId: string,
  page: number,
  limit: number,
  excludeUserId?: string,
): Promise<{ docs: Array<{ user: UserDocument; role: UserRoleDocument }>; total: number }> => {
  const { docs: roleDocs, total } = await findRolesByRestaurant(
    restaurantId,
    page,
    limit,
    excludeUserId,
  );
  if (roleDocs.length === 0) {
    return { docs: [], total };
  }

  const users = await findUsersByIds(roleDocs.map((roleDoc) => roleDoc.userId.toString()));
  const userById = new Map(users.map((user) => [user._id.toString(), user]));

  const docs = roleDocs
    .map((roleDoc) => {
      const user = userById.get(roleDoc.userId.toString());
      return user ? { user, role: roleDoc } : null;
    })
    .filter((entry): entry is { user: UserDocument; role: UserRoleDocument } => entry !== null);

  return { docs, total };
};

export const createUserWithRole = async (
  restaurantId: string,
  payload: CreateUserDTO,
  role: UserRole,
): Promise<{ user: UserDocument; role: UserRoleDocument }> => {
  const user = await createAuthUser(payload);
  const roleDoc = await createUserRole({ userId: user._id.toString(), restaurantId, role });
  return { user, role: roleDoc };
};

export const updateUserRecord = async (
  userId: string,
  payload: Partial<Pick<UserDocument, 'name' | 'email' | 'password' | 'isActive'>>,
): Promise<UserDocument | null> => {
  return updateUserById(userId, payload);
};

export const updateUserRole = async (
  userId: string,
  restaurantId: string,
  role: UserRole,
): Promise<UserRoleDocument | null> => {
  return updateRoleForUserInRestaurant(userId, restaurantId, role);
};

export const updateUserRoleActive = async (
  userId: string,
  restaurantId: string,
  isActive: boolean,
): Promise<UserRoleDocument | null> => {
  return updateRoleActiveForUserInRestaurant(userId, restaurantId, isActive);
};

export const deleteUserInRestaurant = async (
  userId: string,
  restaurantId: string,
): Promise<number> => {
  return deleteRolesForUserInRestaurant(userId, restaurantId);
};

export const deleteUserIfOrphaned = async (userId: string): Promise<void> => {
  const rolesCount = await countRolesForUser(userId);
  if (rolesCount === 0) {
    await deleteAuthUserById(userId);
  }
};

export const countActiveAdmins = async (restaurantId: string): Promise<number> => {
  return countActiveAdminsByRestaurant(restaurantId);
};
