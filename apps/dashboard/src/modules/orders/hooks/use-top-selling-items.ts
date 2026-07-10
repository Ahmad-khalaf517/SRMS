import { useQuery } from '@tanstack/react-query';

import type { TopSellingQuery } from '@srms/api-contracts/orders';
import { getTopSellingItemsRequest } from '@/modules/orders/api';

export const useTopSellingItems = (params: Partial<TopSellingQuery>) => {
  return useQuery({
    queryKey: ['top-selling-items', params],
    queryFn: () => getTopSellingItemsRequest(params),
  });
};
