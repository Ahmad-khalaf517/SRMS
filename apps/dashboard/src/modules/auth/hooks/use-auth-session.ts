import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { setAuthAccessToken } from '@/modules/auth/api/client';
import { getErrorMessage } from '@srms/utils';
import { refreshRequest } from '@/modules/auth/api/refresh';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';

export const useAuthSession = () => {
  const setSession = useAuthSessionStore((state) => state.setSession);
  const clearSession = useAuthSessionStore((state) => state.clearSession);

  const query = useQuery({
    queryKey: ['auth', 'current-user'],
    queryFn: refreshRequest,
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setAuthAccessToken(query.data.data.accessToken);
      setSession({
        user: query.data.data.user,
        accessToken: query.data.data.accessToken,
      });
    }
  }, [query.data, setSession]);

  useEffect(() => {
    if (query.isError) {
      const message = getErrorMessage(query.error);
      if (message !== 'Missing refresh token') {
        toast.error(message);
      }
      setAuthAccessToken(null);
      clearSession();
    }
  }, [clearSession, query.error, query.isError]);

  return query;
};
