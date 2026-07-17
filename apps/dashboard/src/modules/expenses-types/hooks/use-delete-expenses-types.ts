import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { deleteExpensesTypesRequest } from '@/modules/expenses-types/api';

export const useDeleteExpensesTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExpensesTypesRequest(id),
    onSuccess: () => {
      toast.success('Expenses type deleted');
      void queryClient.invalidateQueries({ queryKey: ['expenses-types'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
