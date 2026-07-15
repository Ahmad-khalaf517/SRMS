import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { updateExpensesRequest } from '@/modules/expenses/api';
import type { UpdateExpensesDTO } from '@srms/api-contracts';

export const useUpdateExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpensesDTO }) =>
      updateExpensesRequest(id, payload),
    onSuccess: () => {
      toast.success('Expense updated');
      void queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
