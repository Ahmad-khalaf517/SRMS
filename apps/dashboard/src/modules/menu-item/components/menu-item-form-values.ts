import type { MenuItem } from '@srms/api-contracts';

import type { CreateMenuItemDTO } from '@srms/api-contracts';

export function menuItemToFormValues(menuItem: MenuItem): Partial<CreateMenuItemDTO> {
  return {
    name: menuItem.name,
    description: menuItem.description ?? '',
    price: menuItem.price,
    categoryId: menuItem.categoryId,
    kitchenSectionId: menuItem.kitchenSectionId,
    isAvailable: menuItem.isAvailable,
  };
}
