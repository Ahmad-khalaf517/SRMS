import mongoose from 'mongoose';

import {
  createUserRole,
  findActiveRoleForUser,
  findActiveRoleForUserInRestaurant,
} from '@/modules/auth/repository/user-role.repository';
import { createRestaurant } from '@/modules/auth/repository/restaurant.repository';
import {
  createUser,
  findUserByEmail,
  findUserById,
} from '@/modules/auth/repository/user.repository';
import { hashPassword, verifyPassword } from '@/modules/auth/utils/password.util';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/modules/auth/utils/token.util';
import { ConflictError, UnauthorizedError } from '@/shared/errors/app-error';
import { AuthData, LoginDTO, RegisterDTO, USER_ROLE } from '@srms/api-contracts';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const registerAuth = async (payload: RegisterDTO): Promise<AuthData> => {
  const ownerEmail = normalizeEmail(payload.user.email);
  const restaurantEmail = normalizeEmail(payload.restaurant.email);

  const existingUser = await findUserByEmail(ownerEmail);
  if (existingUser) {
    throw new ConflictError('User email already exists');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const restaurant = await createRestaurant(
      {
        ...payload.restaurant,
        email: restaurantEmail,
      },
      session,
    );

    const hashedPassword = await hashPassword(payload.user.password);

    const user = await createUser(
      {
        name: payload.user.name,
        email: ownerEmail,
        password: hashedPassword,
      },
      session,
    );

    const roleAssignment = await createUserRole(
      {
        userId: user._id.toString(),
        restaurantId: restaurant._id.toString(),
        role: USER_ROLE.ADMIN,
      },
      session,
    );

    await session.commitTransaction();

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      restaurantId: roleAssignment.restaurantId.toString(),
      role: roleAssignment.role,
    });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    return {
      user: {
        id: user._id.toString(),
        restaurantId: roleAssignment.restaurantId.toString(),
        name: user.name,
        email: user.email,
        role: roleAssignment.role,
        isActive: user.isActive,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const loginAuth = async (payload: LoginDTO): Promise<AuthData> => {
  const email = normalizeEmail(payload.email);
  const user = await findUserByEmail(email);

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Inactive account');
  }

  const isPasswordValid = await verifyPassword(payload.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const activeRoleAssignment = await findActiveRoleForUser(user._id.toString());
  if (!activeRoleAssignment) {
    throw new UnauthorizedError('No active role assignment found');
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    restaurantId: activeRoleAssignment.restaurantId.toString(),
    role: activeRoleAssignment.role,
  });
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });

  return {
    user: {
      id: user._id.toString(),
      restaurantId: activeRoleAssignment.restaurantId.toString(),
      name: user.name,
      email: user.email,
      role: activeRoleAssignment.role,
      isActive: user.isActive,
    },
    accessToken,
    refreshToken,
  };
};

export const getCurrentAuthUser = async (
  userId: string,
  restaurantId: string,
  accessToken: string,
): Promise<AuthData> => {
  const user = await findUserById(userId);
  if (!user || !user.isActive) {
    throw new UnauthorizedError('Unauthorized');
  }

  const activeRoleAssignment = await findActiveRoleForUserInRestaurant(userId, restaurantId);
  if (!activeRoleAssignment) {
    throw new UnauthorizedError('No active role assignment found');
  }

  return {
    user: {
      id: user._id.toString(),
      restaurantId: activeRoleAssignment.restaurantId.toString(),
      name: user.name,
      email: user.email,
      role: activeRoleAssignment.role,
      isActive: user.isActive,
    },
    accessToken,
  };
};

export const refreshAuth = async (refreshToken: string): Promise<AuthData> => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await findUserById(payload.userId);

  if (!user || !user.isActive) {
    throw new UnauthorizedError('Unauthorized');
  }

  const activeRoleAssignment = await findActiveRoleForUser(user._id.toString());
  if (!activeRoleAssignment) {
    throw new UnauthorizedError('No active role assignment found');
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    restaurantId: activeRoleAssignment.restaurantId.toString(),
    role: activeRoleAssignment.role,
  });

  return {
    user: {
      id: user._id.toString(),
      restaurantId: activeRoleAssignment.restaurantId.toString(),
      name: user.name,
      email: user.email,
      role: activeRoleAssignment.role,
      isActive: user.isActive,
    },
    accessToken,
  };
};
