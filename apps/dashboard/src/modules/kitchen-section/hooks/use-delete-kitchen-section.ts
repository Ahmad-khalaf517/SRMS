import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { deleteKitchenSectionRequest } from '@/modules/kitchen-section/api';

export const useDeleteKitchenSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteKitchenSectionRequest(id),
    onSuccess: () => {
      toast.success('Kitchen section deleted');
      void queryClient.invalidateQueries({ queryKey: ['kitchen-sections'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
