import type { CreateOrderDTO, MenuItemListItem } from '@srms/api-contracts';

type CartItem = {
  menuItemId: string;
  quantity: number;
  notes?: string;
};

export const mapCartItemsToCreateOrderPayload = (
  cartItems: CartItem[],
  menuItems: MenuItemListItem[],
): CreateOrderDTO => {
  const availableById = new Map(
    menuItems.filter((item) => item.isAvailable).map((item) => [item.id, item] as const),
  );

  return {
    items: cartItems
      .filter((item) => availableById.has(item.menuItemId))
      .map((item) => ({
        menuItemId: item.menuItemId,
        quantity: Math.max(1, Math.floor(item.quantity)),
        notes: item.notes?.trim() || undefined,
      })),
  };
};
