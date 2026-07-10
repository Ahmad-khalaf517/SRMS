import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { createKitchenSectionRequest } from '@/modules/kitchen-section/api';

export const useCreateKitchenSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKitchenSectionRequest,
    onSuccess: () => {
      toast.success('Kitchen section created');
      void queryClient.invalidateQueries({ queryKey: ['kitchen-sections'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
