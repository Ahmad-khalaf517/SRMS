import { Restaurant } from '../restaurant';
import { User } from '../user/user.types';

export type AuthData = {
  user: User;
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
