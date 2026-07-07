import { getCurrentUser } from '@srms/api-client';

import { authApiClient } from '@/modules/auth/api/client';

export const currentUserRequest = async () => {
  return getCurrentUser(authApiClient);
};
