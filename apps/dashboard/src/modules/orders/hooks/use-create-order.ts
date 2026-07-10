import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getErrorMessage } from '@srms/utils';
import { createOrderRequest } from '@/modules/orders/api';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrderRequest,
    onSuccess: () => {
      toast.success('Order created');
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
