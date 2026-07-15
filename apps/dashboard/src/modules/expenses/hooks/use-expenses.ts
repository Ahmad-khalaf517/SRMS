import { useQuery } from '@tanstack/react-query';
import { getExpensesRequest } from '@/modules/expenses/api';

export const useExpenses = (page: number, limit = 10) => {
  return useQuery({
    queryKey: ['expenses', { page, limit }],
    queryFn: () => getExpensesRequest({ page, limit }),
  });
};
