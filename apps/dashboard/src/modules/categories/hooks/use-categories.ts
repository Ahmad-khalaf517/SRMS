import { useQuery } from '@tanstack/react-query';
import { getCategoriesRequest } from '@/modules/categories/api';

export const useCategories = (page: number, limit = 10) => {
  return useQuery({
    queryKey: ['categories', { page, limit }],
    queryFn: () => getCategoriesRequest({ page, limit }),
  });
};
