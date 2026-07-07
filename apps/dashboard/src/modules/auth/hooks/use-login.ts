import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { setAuthAccessToken } from '@/modules/auth/api/client';
import { getErrorMessage } from '@/modules/auth/lib/error-message';
import { loginRequest } from '@/modules/auth/api/login';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';

export const useLogin = () => {
  const setSession = useAuthSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: loginRequest,
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
