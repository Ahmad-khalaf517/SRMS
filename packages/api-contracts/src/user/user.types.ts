import { UserRole } from './constants';

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

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
