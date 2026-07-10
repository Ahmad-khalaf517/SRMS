import { useQuery } from '@tanstack/react-query';

import type { OrderFiltersQuery } from '@srms/api-contracts/orders';
import { getMyOrdersRequest } from '@/modules/orders/api';

export const useMyOrders = (params: Partial<OrderFiltersQuery>) => {
  return useQuery({
    queryKey: ['my-orders', params],
    queryFn: () => getMyOrdersRequest(params),
  });
};
