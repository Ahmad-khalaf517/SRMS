import { registerRestaurantOwner } from '@srms/api-client';
import { type RegisterRequest } from '@srms/types/auth/register';

import { authApiClient } from '@/modules/auth/api/client';

export const registerRequest = async (payload: RegisterRequest) => {
  return registerRestaurantOwner(authApiClient, payload);
};
