import { USER_ROLE } from './constants';
import { PaginationMeta } from '../http';

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type UserRoleAssignment = {
  id: string;
  userId: string;
  restaurantId: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};
export type UserList = {
  data: User[];
  pagination: PaginationMeta;
};

export type UserResponse = {
  success: true;
  message: string;
  data: User;
};

export type UserListResponse = {
  success: true;
  message: string;
  data: UserList;
};
