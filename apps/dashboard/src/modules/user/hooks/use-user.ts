import { useQuery } from '@tanstack/react-query';
import { getUserRequest } from '@/modules/user/api';

export const useUser = (page: number, limit = 10) => {
  return useQuery({
    queryKey: ['user', { page, limit }],
    queryFn: () => getUserRequest({ page, limit }),
  });
};
