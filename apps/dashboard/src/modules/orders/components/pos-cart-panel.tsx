import { PosCartItemRow } from '@/modules/orders/components/pos-cart-item-row';

type PosCartPanelProps = {
  items: Array<{
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }>;
  onDecrement: (menuItemId: string) => void;
  onIncrement: (menuItemId: string) => void;
  onRemove: (menuItemId: string) => void;
  onUpdateNotes: (menuItemId: string, notes?: string) => void;
};

export function PosCartPanel({
  items,
  onDecrement,
  onIncrement,
  onRemove,
  onUpdateNotes,
}: PosCartPanelProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Cart is empty. Add menu items to start an order.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <PosCartItemRow
          key={item.menuItemId}
          item={item}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          onRemove={onRemove}
          onUpdateNotes={onUpdateNotes}
        />
      ))}
    </div>
  );
}
