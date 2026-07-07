import { type AuthResponse } from './auth.types.js';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = AuthResponse;
