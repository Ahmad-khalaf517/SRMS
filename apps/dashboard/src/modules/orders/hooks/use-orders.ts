import { useQuery } from '@tanstack/react-query';

import type { OrderFiltersQuery } from '@srms/api-contracts/orders';
import { getOrdersRequest } from '@/modules/orders/api';

export const useOrders = (params: Partial<OrderFiltersQuery>) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrdersRequest(params),
  });
};
