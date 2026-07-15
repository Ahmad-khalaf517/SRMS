import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { createExpensesRequest } from '@/modules/expenses/api';

export const useCreateExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpensesRequest,
    onSuccess: () => {
      toast.success('Expense created');
      void queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
