import { useQuery } from '@tanstack/react-query';

import type { OrderMetricsQuery } from '@srms/api-contracts/orders';
import { getOrderMetricsRequest } from '@/modules/orders/api';

export const useOrderMetrics = (params: Partial<OrderMetricsQuery>) => {
  return useQuery({
    queryKey: ['order-metrics', params],
    queryFn: () => getOrderMetricsRequest(params),
  });
};
