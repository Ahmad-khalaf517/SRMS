import { useQuery } from '@tanstack/react-query';
import { getKitchenSectionsRequest } from '@/modules/kitchen-section/api';

export const useKitchenSections = (page: number, limit = 10) => {
  return useQuery({
    queryKey: ['kitchen-sections', { page, limit }],
    queryFn: () => getKitchenSectionsRequest({ page, limit }),
  });
};
