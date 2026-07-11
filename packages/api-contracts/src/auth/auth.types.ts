import { Restaurant } from '../restaurant';
import { User } from '../user/user.types';

type SessionUser = Omit<User, 'createdAt' | 'updatedAt'>;

export type AuthData = {
  user: SessionUser;
  accessToken: string;
  refreshToken?: string;
  restaurant: Restaurant | null;
};

export type AuthResponse = {
  success: true;
  message: string;
  data: AuthData;
};

export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;
