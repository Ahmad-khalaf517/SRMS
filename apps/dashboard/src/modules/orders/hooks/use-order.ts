import { useQuery } from '@tanstack/react-query';

import { getOrderRequest } from '@/modules/orders/api';

export const useOrder = (id: string | null) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderRequest(id as string),
    enabled: !!id,
  });
};
