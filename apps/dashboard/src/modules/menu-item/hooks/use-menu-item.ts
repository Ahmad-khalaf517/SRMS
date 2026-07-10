import { useQuery } from '@tanstack/react-query';

import { getMenuItemRequest } from '@/modules/menu-item/api';

export const useMenuItem = (id: string | null) => {
  return useQuery({
    queryKey: ['menu-item', id],
    queryFn: () => getMenuItemRequest(id as string),
    enabled: Boolean(id),
  });
};
