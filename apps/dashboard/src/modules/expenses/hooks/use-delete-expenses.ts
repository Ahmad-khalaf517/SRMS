import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { deleteExpensesRequest } from '@/modules/expenses/api';

export const useDeleteExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExpensesRequest(id),
    onSuccess: () => {
      toast.success('Expense deleted');
      void queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
