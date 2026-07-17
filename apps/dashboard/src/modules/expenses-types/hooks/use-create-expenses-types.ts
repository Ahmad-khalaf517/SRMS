import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { createExpensesTypesRequest } from '@/modules/expenses-types/api';

export const useCreateExpensesTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpensesTypesRequest,
    onSuccess: () => {
      toast.success('Expenses type created');
      void queryClient.invalidateQueries({ queryKey: ['expenses-types'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
