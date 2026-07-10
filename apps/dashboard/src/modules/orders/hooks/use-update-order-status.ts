import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getErrorMessage } from '@srms/utils';
import type { UpdateOrderStatusDTO } from '@srms/api-contracts/orders';
import { updateOrderStatusRequest } from '@/modules/orders/api';

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderStatusDTO }) =>
      updateOrderStatusRequest(id, payload),
    onSuccess: () => {
      toast.success('Order status updated');
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      void queryClient.invalidateQueries({ queryKey: ['order-metrics'] });
      void queryClient.invalidateQueries({ queryKey: ['top-selling-items'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
