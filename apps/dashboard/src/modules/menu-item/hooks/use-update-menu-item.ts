import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getErrorMessage } from '@srms/utils';
import { updateMenuItemRequest } from '@/modules/menu-item/api';
import type { UpdateMenuItemDTO } from '@srms/api-contracts/menu-item';

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMenuItemDTO }) =>
      updateMenuItemRequest(id, payload),
    onSuccess: () => {
      toast.success('Menu item updated');
      void queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      void queryClient.invalidateQueries({ queryKey: ['menu-item'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
