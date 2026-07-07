import { type AuthResponse } from './auth.types.js';

export type RegisterRestaurantInput = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

export type RegisterOwnerInput = {
  name: string;
  email: string;
  password: string;
};

export type RegisterRequest = {
  restaurant: RegisterRestaurantInput;
  user: RegisterOwnerInput;
};

export type RegisterResponse = AuthResponse;
