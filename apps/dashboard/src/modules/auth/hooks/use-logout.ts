import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { setAuthAccessToken } from '@/modules/auth/api/client';
import { logoutRequest } from '@/modules/auth/api';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';
import { getErrorMessage } from '@srms/utils';

export const useLogout = () => {
  const navigate = useNavigate();
  const clearSession = useAuthSessionStore((state) => state.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      setAuthAccessToken(null);
      clearSession();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
