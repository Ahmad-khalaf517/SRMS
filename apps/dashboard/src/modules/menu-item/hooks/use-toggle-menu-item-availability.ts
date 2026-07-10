import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getErrorMessage } from '@srms/utils';
import { toggleMenuItemAvailabilityRequest } from '@/modules/menu-item/api';
import type { ToggleMenuItemAvailabilityInput } from '@srms/api-contracts/menu-item';

export const useToggleMenuItemAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ToggleMenuItemAvailabilityInput }) =>
      toggleMenuItemAvailabilityRequest(id, payload),
    onSuccess: () => {
      toast.success('Availability updated');
      void queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      void queryClient.invalidateQueries({ queryKey: ['menu-item'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
