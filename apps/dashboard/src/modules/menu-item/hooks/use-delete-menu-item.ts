import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getErrorMessage } from '@srms/utils';
import { deleteMenuItemRequest } from '@/modules/menu-item/api';

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMenuItemRequest(id),
    onSuccess: () => {
      toast.success('Menu item deleted');
      void queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
