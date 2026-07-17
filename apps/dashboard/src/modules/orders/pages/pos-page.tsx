import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useMenuItems } from '@/modules/menu-item/hooks/use-menu-items';
import { useCreateOrder } from '@/modules/orders/hooks';
import { PosMenuBrowser } from '@/modules/orders/components/pos-menu-browser';
import { PosOrderSummary } from '@/modules/orders/components/pos-order-summary';
import { mapCartItemsToCreateOrderPayload } from '@/modules/orders/schemas/pos-order.schema';
import { usePosCartStore } from '@/modules/orders/store/pos-cart.store';

const TAX_RATE = 0.1;

export default function PosPage() {
  const [cartHighlightToken, setCartHighlightToken] = useState(0);

  const menuItemsQuery = useMenuItems({ page: 1, limit: 100, isAvailable: true });
  const createOrderMutation = useCreateOrder();

  const items = usePosCartStore((state) => state.items);
  const subtotal = usePosCartStore((state) => state.getSubtotal());
  const addItem = usePosCartStore((state) => state.addItem);
  const decrementItem = usePosCartStore((state) => state.decrementItem);
  const removeItem = usePosCartStore((state) => state.removeItem);
  const updateNotes = usePosCartStore((state) => state.updateNotes);
  const clearCart = usePosCartStore((state) => state.clearCart);
  const resetAfterSubmit = usePosCartStore((state) => state.resetAfterSubmit);

  const tax = useMemo(() => Number((subtotal * TAX_RATE).toFixed(2)), [subtotal]);
  const total = useMemo(() => Number((subtotal + tax).toFixed(2)), [subtotal, tax]);

  const menuItems = menuItemsQuery.data?.data.data ?? [];

  const onPlaceOrder = () => {
    const payload = mapCartItemsToCreateOrderPayload(items, menuItems);

    if (payload.items.length === 0) {
      toast.error('Add at least one available item before placing the order.');
      return;
    }

    createOrderMutation.mutate(payload, {
      onSuccess: (response) => {
        resetAfterSubmit();
        toast.success(`Order ${response.data.orderNumber} placed successfully.`);
      },
    });
  };

  const incrementItem = useCallback(
    (menuItemId: string) => {
      const item = items.find((entry) => entry.menuItemId === menuItemId);
      if (!item) {
        return;
      }

      addItem({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    },
    [addItem, items],
  );

  const handleAddItemFromMenu = useCallback(
    (item: (typeof menuItems)[number]) => {
      addItem({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
      });
      setCartHighlightToken((value) => value + 1);
    },
    [addItem],
  );

  return (
    <div className="grow flex flex-col gap-6 p-4 lg:p-6 overflow-hidden">
      <div>
        <h1 className="text-xl font-semibold">Point of Sale</h1>
        <p className="text-sm text-muted-foreground">
          Create orders by adding available menu items to the cart.
        </p>
      </div>

      <div className="grow grid gap-6 xl:grid-cols-[1.3fr_1fr] overflow-hidden p-1">
        <PosMenuBrowser
          menuItems={menuItems}
          isLoading={menuItemsQuery.isLoading}
          onAddItem={handleAddItemFromMenu}
        />

        <PosOrderSummary
          items={items}
          subtotal={subtotal}
          tax={tax}
          total={total}
          canSubmit={items.length > 0}
          isSubmitting={createOrderMutation.isPending}
          onDecrement={decrementItem}
          onIncrement={incrementItem}
          onRemove={removeItem}
          onUpdateNotes={updateNotes}
          onClear={clearCart}
          onSubmit={onPlaceOrder}
          highlightToken={cartHighlightToken}
        />
      </div>
    </div>
  );
}
