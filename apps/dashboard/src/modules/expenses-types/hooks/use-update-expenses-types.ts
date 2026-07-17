import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { updateExpensesTypesRequest } from '@/modules/expenses-types/api';
import type { UpdateExpensesTypesDTO } from '@srms/api-contracts';

export const useUpdateExpensesTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpensesTypesDTO }) =>
      updateExpensesTypesRequest(id, payload),
    onSuccess: () => {
      toast.success('Expenses type updated');
      void queryClient.invalidateQueries({ queryKey: ['expenses-types'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
