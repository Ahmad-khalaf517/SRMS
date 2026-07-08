import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { setAuthAccessToken } from '@/modules/auth/api/client';
import { getErrorMessage } from '@srms/utils';
import { registerRequest } from '@/modules/auth/api';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';

export const useRegister = () => {
  const setSession = useAuthSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: registerRequest,
    onSuccess: (response) => {
      setAuthAccessToken(response.data.accessToken);
      setSession({
        user: response.data.user,
        accessToken: response.data.accessToken,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
