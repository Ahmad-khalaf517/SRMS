import { useQuery } from '@tanstack/react-query';

import { getMenuItemsRequest } from '@/modules/menu-item/api';
import type { MenuItemFiltersQuery } from '@srms/api-contracts/menu-item';

export const useMenuItems = (params: Partial<MenuItemFiltersQuery>) => {
  return useQuery({
    queryKey: ['menu-items', params],
    queryFn: () => getMenuItemsRequest(params),
  });
};
