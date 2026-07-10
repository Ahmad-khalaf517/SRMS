import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@srms/utils';
import { updateKitchenSectionRequest } from '@/modules/kitchen-section/api';
import type { UpdateKitchenSectionDTO } from '@srms/api-contracts';

export const useUpdateKitchenSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateKitchenSectionDTO }) =>
      updateKitchenSectionRequest(id, payload),
    onSuccess: () => {
      toast.success('Kitchen section updated');
      void queryClient.invalidateQueries({ queryKey: ['kitchen-sections'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
