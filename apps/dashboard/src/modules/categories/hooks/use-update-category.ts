import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { updateCategoryRequest } from '@/modules/categories/api';
import type { UpdateCategoryDTO } from '@srms/api-contracts';

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryDTO }) =>
      updateCategoryRequest(id, payload),
    onSuccess: () => {
      toast.success('Category updated');
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
