import { useQuery } from '@tanstack/react-query';
import { getExpensesTypesRequest } from '@/modules/expenses-types/api';

export const useExpensesTypes = (page: number, limit = 10) => {
  return useQuery({
    queryKey: ['expenses-types', { page, limit }],
    queryFn: () => getExpensesTypesRequest({ page, limit }),
  });
};
