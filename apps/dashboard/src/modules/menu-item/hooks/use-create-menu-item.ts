import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getErrorMessage } from '@srms/utils';
import { createMenuItemRequest } from '@/modules/menu-item/api';

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMenuItemRequest,
    onSuccess: () => {
      toast.success('Menu item created');
      void queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
