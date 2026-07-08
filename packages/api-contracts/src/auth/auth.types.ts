import { User } from '../user/user.types';

export type AuthData = {
  user: User;
  accessToken: string;
  refreshToken?: string;
};

export type AuthResponse = {
  success: true;
  message: string;
  data: AuthData;
};

export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;
