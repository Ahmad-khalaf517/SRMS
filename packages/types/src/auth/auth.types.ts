import { type UserRole } from '../users/user-role.js';

export type Restaurant = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type UserRoleAssignment = {
  id: string;
  userId: string;
  restaurantId: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthData = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
};

export type AuthResponse = {
  success: true;
  message: string;
  data: AuthData;
};
